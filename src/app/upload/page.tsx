'use client'

import { useState } from 'react'
import Link from 'next/link'
import FileUploader from '@/components/FileUploader'

export default function UploadPage() {
  const [selectedCity, setSelectedCity] = useState('烟台')
  const [selectedYear, setSelectedYear] = useState(2024)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleCitiesUpload = async (file: File) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/cities', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: result.message })
      } else {
        const errorMsg = result.error || result.details || '上传失败'
        console.error('Cities upload error:', result)
        setMessage({ type: 'error', text: errorMsg })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '上传过程中发生错误' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSalariesUpload = async (file: File) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/salaries', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: result.message })
      } else {
        const errorMsg = result.error || result.details || '上传失败'
        console.error('Salaries upload error:', result)
        setMessage({ type: 'error', text: errorMsg })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '上传过程中发生错误' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCalculate = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: selectedCity,
          year: selectedYear,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: result.message })
      } else {
        setMessage({ type: 'error', text: result.error || '计算失败' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '计算过程中发生错误' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-500 text-sm flex items-center"
          >
            ← 返回首页
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">数据上传</h1>
          <p className="mt-2 text-gray-600">
            上传Excel数据并执行计算
          </p>
        </div>

        {message && (
          <div
            className={`
              mb-6 p-4 rounded-md
              ${message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
              }
            `}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">计算参数</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                城市
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="烟台">烟台</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年份
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2023">2023</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FileUploader
            title="上传城市标准数据"
            description="Excel文件格式：city_name, year, base_min, base_max, rate"
            accept=".xlsx,.xls"
            onFileSelect={handleCitiesUpload}
            isLoading={isLoading}
          />

          <FileUploader
            title="上传员工工资数据"
            description="Excel文件格式：employee_id, employee_name, month, salary_amount"
            accept=".xlsx,.xls"
            onFileSelect={handleSalariesUpload}
            isLoading={isLoading}
          />

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">执行计算</h3>
            <button
              onClick={handleCalculate}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '处理中...' : '执行计算并存储结果'}
            </button>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">使用说明</h3>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>城市标准：定义社保基数上下限和缴费比例</li>
            <li>工资数据：包含员工的月度工资金额</li>
            <li>月份格式：YYYYMM（如202401表示2024年1月）</li>
            <li>计算结果将覆盖同城市同年的旧数据</li>
          </ul>
        </div>
      </div>
    </div>
  )
}