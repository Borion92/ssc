'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DebugPage() {
  const [cities, setCities] = useState<any[]>([])
  const [salaries, setSalaries] = useState<any[]>([])
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch all data
        const [citiesRes, salariesRes, resultsRes] = await Promise.all([
          fetch('/api/results?city=烟台').then(r => r.json()),
          fetch('/api/results').then(r => r.json())
        ])

        // Need to create separate API endpoints to get cities and salaries
        // For now, let's use the existing API to get some info
        setResults(resultsRes.data || [])

        // Try to get info by triggering calculation
        const calcRes = await fetch('/api/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ city: '烟台', year: 2024 })
        })
        const calcData = await calcRes.json()
        console.log('Calculation response:', calcData)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            ← 返回首页
          </Link>
          <h1 className="mt-4 text-3xl font-bold">调试页面</h1>
        </div>

        {loading && <p>加载中...</p>}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            错误: {error}
          </div>
        )}

        <div className="grid gap-6">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">结果数据 ({results.length} 条)</h2>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>

          <div className="bg-yellow-50 p-6 rounded">
            <h2 className="text-xl font-semibold mb-4">手动检查步骤</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>打开 Supabase 控制台</li>
              <li>进入 Table Editor</li>
              <li>检查 cities 表 - 应该有烟台 2024 和 2025 的数据</li>
              <li>检查 salaries 表 - 是否有数据？</li>
              <li>检查 results 表 - 是否有数据？</li>
              <li>如果没有数据，检查 Excel 文件格式是否正确</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}