# 五险一金计算器

一个基于 Next.js + Tailwind CSS + Supabase 构建的简化版社保公积金公司缴费计算器。

## 功能特点

- 📊 支持Excel文件上传（城市标准、员工工资）
- 🧮 自动计算社保公积金缴费
- 📋 清晰的结果展示
- 🔒 安全的服务端计算（不暴露敏感密钥）
- 📱 响应式设计，支持移动端

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (Postgres)
- **文件处理**: xlsx (Excel解析)

## 环境要求

- Node.js 18 或更高版本
- npm 或 yarn 包管理器

## 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd social-security-calculator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在项目设置中获取以下信息：
   - Project URL
   - anon public key
3. 复制 `.env.example` 文件并重命名为 `.env.local`
4. 填入你的 Supabase 配置：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 创建数据库表

在 Supabase SQL 编辑器中执行以下语句：

```sql
-- 城市标准表
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  city_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  base_min NUMERIC NOT NULL,
  base_max NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 员工工资表
CREATE TABLE salaries (
  id SERIAL PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month INTEGER NOT NULL,
  salary_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 计算结果表
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary NUMERIC NOT NULL,
  contribution_base NUMERIC NOT NULL,
  rate NUMERIC NOT NULL,
  company_fee_month NUMERIC NOT NULL,
  company_fee_year NUMERIC NOT NULL,
  year INTEGER NOT NULL,
  city_name TEXT NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. 插入默认数据

```sql
INSERT INTO cities (city_name, year, base_min, base_max, rate)
VALUES ('烟台', 2025, 4504, 22518, 0.14);
```

### 6. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### Excel 文件格式

#### 城市标准数据 (cities.xlsx)
| 列名 | 说明 | 示例 |
|------|------|------|
| city_name | 城市名称 | 烟台 |
| year | 年份 | 2025 |
| base_min | 社保基数下限 | 4504 |
| base_max | 社保基数上限 | 22518 |
| rate | 综合缴纳比例 | 0.14 |

#### 员工工资数据 (salaries.xlsx)
| 列名 | 说明 | 示例 |
|------|------|------|
| employee_id | 员工工号 | EMP001 |
| employee_name | 员工姓名 | 张三 |
| month | 年份月份 | 202401 |
| salary_amount | 工资金额 | 8000 |

**注意**：
- month 字段格式为 YYYYMM（如 202401 表示 2024 年 1 月）
- 支持 .xlsx 和 .xls 格式
- 第一行可以是表头，也可以直接是数据

## 计算规则

1. 按员工姓名分组计算年度月平均工资
2. 缴费基数根据城市标准进行限制：
   - 低于基数下限：使用下限
   - 高于基数上限：使用上限
   - 在范围内：使用实际平均工资
3. 公司月缴费 = 缴费基数 × 缴费比例
4. 公司年缴费 = 月缴费 × 12

## 项目结构

```
social-security-calculator/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── page.tsx         # 主页
│   │   ├── upload/          # 上传页面
│   │   ├── results/         # 结果页面
│   │   └── api/             # API 路由
│   ├── components/          # React 组件
│   │   ├── NavigationCard.tsx
│   │   ├── FileUploader.tsx
│   │   └── ResultTable.tsx
│   └── lib/                 # 工具函数
│       ├── supabase.ts      # Supabase 客户端
│       ├── excel-parser.ts  # Excel 解析
│       └── calculator.ts    # 计算逻辑
├── public/                  # 静态资源
├── .env.local              # 环境变量（不提交）
└── .env.example            # 环境变量模板
```

## 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 在 Vercel 设置中添加环境变量
4. 自动部署完成

### 其他平台

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 安全注意事项

- ✅ 本项目仅使用 Supabase anon key，无需 service role key
- ✅ 所有数据库操作通过 API Routes 进行
- ✅ 敏感配置使用环境变量存储
- ✅ .env.local 已添加到 .gitignore
- 🔒 建议在 Supabase 控制台中为表设置适当的 RLS（行级安全）策略

## 许可证

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！
