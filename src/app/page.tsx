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
      </div>
    </div>
  )
}
