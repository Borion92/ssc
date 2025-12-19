'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ResultTable from '@/components/ResultTable'

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

export default function ResultsPage() {
  const [results, setResults] = useState<ResultData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [availableYears, setAvailableYears] = useState<number[]>([])

  const fetchResults = async (city?: string, year?: string) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (year) params.append('year', year)

      const response = await fetch(`/api/results?${params}`)
      const result = await response.json()

      if (response.ok) {
        setResults(result.data || [])

        // Extract unique years from data
        const uniqueYears = new Set<number>()
        ;(result.data || []).forEach((r: ResultData) => uniqueYears.add(r.year))
        const years = Array.from(uniqueYears).sort((a, b) => b - a)
        setAvailableYears(years)
      } else {
        console.error('Failed to fetch results:', result.error)
        setResults([])
      }
    } catch (error) {
      console.error('Error fetching results:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  const handleFilter = () => {
    fetchResults(selectedCity, selectedYear)
  }

  const handleClear = () => {
    setSelectedCity('')
    setSelectedYear('')
    fetchResults()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm flex items-center"
          >
            ← 返回首页
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">计算结果</h1>
          <p className="mt-2 text-gray-600">
            查看社保公积金缴费计算结果
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">筛选条件</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部城市</option>
                <option value="烟台">烟台</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年份
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">全部年份</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={handleFilter}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                筛选
              </button>
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                清除
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ResultTable data={results} isLoading={isLoading} />
        </div>

        {results.length > 0 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">数据说明</h3>
            <ul className="list-disc list-inside space-y-1 text-yellow-700 text-sm">
              <li>缴费基数已根据社保政策自动调整</li>
              <li>月缴费额 = 缴费基数 × 缴费比例</li>
              <li>年缴费额 = 月缴费额 × 12</li>
              <li>计算时间：{new Date(results[0].calculated_at).toLocaleString('zh-CN')}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}