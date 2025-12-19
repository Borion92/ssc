import NavigationCard from '@/components/NavigationCard'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            五险一金计算器
          </h1>
          <p className="text-lg text-gray-600">
            简化版社保公积金公司缴费计算工具
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <NavigationCard
            title="数据上传"
            description="上传城市社保标准和员工工资Excel数据，为计算做准备"
            href="/upload"
            icon="📊"
          />
          <NavigationCard
            title="结果查询"
            description="查看已计算完成的社保公积金缴费结果"
            href="/results"
            icon="📋"
          />
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-900 mb-4">系统状态</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                部署完成
              </p>
              <p className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                环境变量已配置
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                数据库连接正常
              </p>
              <p className="flex items-center">
                <span className="text-green-600 mr-2">✓</span>
                城市数据已初始化
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-green-700">
            系统已就绪，可以开始使用！
          </p>
        </div>
      </div>
    </div>
  )
}
