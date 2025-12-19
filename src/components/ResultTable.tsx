interface ResultData {
  id: number
  employee_name: string
  avg_salary: number
  contribution_base: number
  rate: number
  company_fee_month: number
  company_fee_year: number
  year: number
  city_name: string
  calculated_at: string
}

interface ResultTableProps {
  data: ResultData[]
  isLoading?: boolean
}

export default function ResultTable({ data, isLoading = false }: ResultTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <p className="text-gray-600">暂无数据</p>
          <p className="text-sm text-gray-500 mt-1">请先上传数据并执行计算</p>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              员工姓名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              平均工资
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              缴费基数
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              缴费比例
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              月缴费额
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              年缴费额
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              城市
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {row.employee_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ¥{row.avg_salary.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ¥{row.contribution_base.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(row.rate * 100).toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ¥{row.company_fee_month.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ¥{row.company_fee_year.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.city_name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-600">
        <p>共 {data.length} 条记录</p>
        {data.length > 0 && (
          <p className="mt-1">
            年缴费总额：¥{data.reduce((sum, row) => sum + row.company_fee_year, 0).toFixed(2)}
          </p>
        )}
      </div>
    </div>
  )
}