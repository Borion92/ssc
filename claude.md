# 五险一金计算器项目文档

## 项目目标与非目标

### 目标
构建一个迷您"五险一金（简化版）"公司缴费计算器，能够：
- 上传城市社保标准和员工工资Excel数据
- 根据规则计算公司应缴纳的社保公积金费用
- 展示所有员工的计算结果

### 非目标（第一版不做）
- 用户登录系统
- 多险种拆分（养老、医疗等分开计算）
- 数据导出功能
- 历史版本管理
- 批量城市支持
- 复杂的统计分析
- RLS（行级安全）
- 模板下载功能

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (Postgres)
- **文件处理**: xlsx (Excel解析)
- **运行环境**: Node.js

## 项目目录结构建议
```
/
├── app/
│   ├── page.js                    # 主页
│   ├── upload/
│   │   └── page.js               # 上传页面
│   ├── results/
│   │   └── page.js               # 结果展示页
│   └── api/
│       ├── upload/
│       │   ├── cities/route.js   # 城市数据上传API
│       │   └── salaries/route.js # 工资数据上传API
│       ├── calculate/route.js    # 计算API
│       └── results/route.js      # 结果查询API
├── components/
│   ├── NavigationCard.js         # 导航卡片
│   ├── FileUploader.js           # 文件上传组件
│   └── ResultTable.js            # 结果表格组件
├── lib/
│   ├── supabase.js              # Supabase客户端配置
│   ├── excel-parser.js          # Excel解析工具
│   └── calculator.js            # 计算逻辑
└── types/
    └── index.js                 # TypeScript类型定义（如使用）
```

## 数据库设计

### cities 表（城市标准）
表结构说明：
- id: 整数类型，主键，自增
- city_name: 文本类型，城市名称，不能为空
- year: 整数类型，年份（如2025），不能为空
- base_min: 数值类型，社保基数下限，不能为空
- base_max: 数值类型，社保基数上限，不能为空
- rate: 数值类型，综合缴纳比例（如0.14），不能为空
- created_at: 时间戳类型，创建时间，默认为当前时间
- 注意：不包含updated_at字段

### salaries 表（员工工资）
表结构说明：
- id: 整数类型，主键，自增
- employee_id: 文本类型，员工工号，不能为空
- employee_name: 文本类型，员工姓名，不能为空
- month: 整数类型，年份月份（YYYYMM格式，如202401），不能为空
- salary_amount: 数值类型，工资金额，不能为空
- created_at: 时间戳类型，创建时间，默认为当前时间

### results 表（计算结果）
表结构说明：
- id: 整数类型，主键，自增
- employee_name: 文本类型，员工姓名，不能为空
- avg_salary: 数值类型，年度月平均工资，不能为空
- contribution_base: 数值类型，最终缴费基数，不能为空
- rate: 数值类型，缴纳比例，不能为空
- company_fee_month: 数值类型，月缴费金额，不能为空
- company_fee_year: 数值类型，年缴费金额，不能为空
- year: 整数类型，计算年份，不能为空
- city_name: 文本类型，城市名称，不能为空
- calculated_at: 时间戳类型，计算时间，默认为当前时间

## 业务逻辑

### 计算规则
1. **数据筛选**: 从 salaries 表筛选指定年份（month前4位）的工资数据
2. **分组统计**: 按 employee_name 分组计算
   - avg_salary = SUM(salary_amount) / COUNT(DISTINCT month)
   - 注：即使某员工缺少部分月份数据，仍按实际月份计算平均值
3. **基数确定**:
   - 从 cities 表获取选定城市和年份的 base_min、base_max、rate
   - contribution_base = clamp(avg_salary, base_min, base_max)
   - clamp规则：低于下限用下限，高于上限用上限，中间用实际值
4. **费用计算**:
   - company_fee_month = contribution_base * rate
   - company_fee_year = company_fee_month * 12
5. **存储策略**:
   - 计算前删除 results 表中 city_name=所选城市 且 year=所选年份 的所有记录
   - 插入新的计算结果

### 端到端数据流
1. **数据上传**: Excel → 前端解析 → API路由 → Supabase表
2. **计算执行**: 前端触发 → API路由 → 读取数据 → 执行计算 → 写入results表
3. **结果展示**: 页面加载 → API路由 → 查询results → 表格渲染

## 页面功能

### 1. 主页 (/)
- 布局：简洁的两张卡片设计
- 卡片1："数据上传" → 链接到 /upload
- 卡片2："结果查询" → 链接到 /results

### 2. 上传页面 (/upload)
- 功能区域：
  - 城市选择器（默认烟台）
  - 年份选择器（默认2025）
  - 上传按钮1：上传城市标准Excel
  - 上传按钮2：上传员工工资Excel
  - 执行按钮：执行计算并存储结果
- 提示信息：上传格式说明和注意事项

### 3. 结果展示页 (/results)
- 功能区域：
  - 筛选器：年份、城市
  - 数据表格：展示所有计算结果
  - 表格列：员工姓名、平均工资、缴费基数、月缴费额、年缴费额
- 分页或滚动（根据数据量）

## Excel 文件格式

### cities Excel 列名（固定）
1. city_name（城市名称）
2. year（年份，整数）
3. base_min（社保基数下限）
4. base_max（社保基数上限）
5. rate（综合缴纳比例）

### salaries Excel 列名（固定）
1. employee_id（员工工号）
2. employee_name（员工姓名）
3. month（年份月份，YYYYMM格式的整数）
4. salary_amount（工资金额）

## 详细 Todo List

### 阶段1：环境搭建与初始化
1. **创建Next.js项目**
   - 验收标准: 成功运行 npx create-next-app@latest 并启动开发服务器

2. **安装依赖包**
   - 验收标准: package.json包含：@supabase/supabase-js, xlsx, tailwindcss

3. **配置Tailwind CSS**
   - 验收标准: 样式生效，可以应用bg-blue-500等类名

4. **创建Supabase项目**
   - 验收标准: 获得项目URL和anon key，能访问控制台

5. **设置环境变量**
   - 验收标准: 创建.env.local文件，包含NEXT_PUBLIC_SUPABASE_URL等必要变量

### 阶段2：数据库建设
6. **创建数据表**
   - 验收标准: 在Supabase控制台成功创建cities、salaries、results三张表
   - 验收标准: 所有字段类型正确，year和month使用integer类型

7. **插入默认数据**
   - 验收标准: cities表包含烟台2025年数据（base_min=4504, base_max=22518, rate=0.14）

8. **确认表访问权限**
   - 验收标准: 不启用RLS，确保表可正常读写，无权限错误

### 阶段3：后端API开发
9. **Supabase客户端配置**
   - 验收标准: lib/supabase.js正确导出客户端实例

10. **城市数据上传API**
    - 验收标准: POST /api/upload/cities能接收并存储Excel数据
    - 验收标准: 支持有表头和无表头两种Excel格式

11. **工资数据上传API**
    - 验收标准: POST /api/upload/salaries能接收并存储Excel数据
    - 验收标准: month字段正确处理YYYYMM格式的整数

12. **计算API**
    - 验收标准: POST /api/calculate能正确执行所有计算逻辑
    - 验收标准: 计算前删除指定city+year的旧数据，计算后存储新结果

13. **结果查询API**
    - 验收标准: GET /api/results能返回指定条件的计算结果
    - 验收标准: 支持按年份和城市筛选

### 阶段4：前端页面开发
14. **主页组件**
    - 验收标准: 显示两张美观的导航卡片
    - 验收标准: 点击卡片能正确跳转到对应页面

15. **文件上传组件**
    - 验收标准: FileUploader组件能选择Excel文件
    - 验收标准: 上传时显示加载状态和进度提示

16. **Excel解析功能**
    - 验收标准: lib/excel-parser.js能正确解析两种格式的Excel
    - 验收标准: 数据格式转换正确（数字、日期等）

17. **上传页面完整实现**
    - 验收标准: 页面集成所有功能组件
    - 验收标准: 城市和年份选择器正常工作
    - 验收标准: 上传和计算按钮触发正确的API调用

18. **结果表格组件**
    - 验收标准: ResultTable组件能展示数据
    - 验收标准: 表格样式美观，支持响应式

19. **结果页面完整实现**
    - 验收标准: 页面加载时自动获取并展示数据
    - 验收标准: 筛选器能正确过滤结果

### 阶段5：测试与优化
20. **完整流程测试**
    - 验收标准: 能完成"上传数据→执行计算→查看结果"全流程
    - 验收标准: 边界情况处理正确（空数据、错误格式等）

21. **错误处理优化**
    - 验收标准: 所有操作有明确的错误提示
    - 验收标准: API返回规范的错误信息

22. **UI/UX优化**
    - 验收标准: 页面交互流畅，反馈及时
    - 验收标准: 移动端显示基本正常

### 阶段6：文档与部署
23. **编写README**
    - 验收标准: 包含项目说明、环境要求、运行步骤
    - 验收标准: 提供测试数据示例

24. **部署准备**
    - 验收标准: 环境变量配置文档完整
    - 验收标准: 构建脚本正常工作

## 风险点与简化策略

### 安全风险
- **问题**: Supabase service_role key暴露在前端
- **解决方案**: 所有写入操作通过Next.js API Routes执行，service_role key仅在后端使用
- **实施**: 环境变量区分NEXT_PUBLIC_前缀，确保敏感key仅服务端可访问

### 性能风险
- **问题**: 大量Excel文件可能导致解析超时
- **解决方案**: 第一版限制文件大小（如5MB），添加进度提示
- **简化策略**: 暂不实现分片上传或流式处理

### 数据一致性风险
- **问题**: 并发计算可能导致数据错乱
- **解决方案**: 使用数据库事务，先删除指定city+year的数据再插入
- **简化策略**: 第一版添加简单的操作提示，避免并发操作

### 用户体验风险
- **问题**: Excel格式错误导致上传失败
- **解决方案**: 页面提供清晰的格式说明
- **简化策略**: 暂不支持复杂的格式自动修复或模板下载

## 最小运行说明

### 环境要求
- Node.js 18或更高版本
- npm 或 yarn 包管理器

### 快速开始步骤
1. 克隆项目到本地目录
2. 运行npm install安装所有必需的依赖包
3. 创建.env.local文件并配置Supabase相关环境变量
4. 登录Supabase控制台，手动创建三张数据表
5. 向cities表插入默认的烟台2025年数据
6. 执行npm run dev命令启动开发服务器
7. 打开浏览器访问http://localhost:3000即可使用应用

### 测试数据准备
- 准备城市标准Excel文件，严格按照顺序包含：city_name, year, base_min, base_max, rate
- 准备员工工资Excel文件，严格按照顺序包含：employee_id, employee_name, month, salary_amount
- 确保月份格式为YYYYMM的整数形式，例如202401表示2024年1月

## 安全策略声明

本项目不启用RLS（行级安全），不实现用户登录系统。所有数据库写入操作和计算逻辑通过Next.js服务端API执行，Supabase service_role密钥仅存储在服务端环境变量中，不会暴露给前端。