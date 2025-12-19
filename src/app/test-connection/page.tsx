'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function TestConnectionPage() {
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  async function testConnection() {
    try {
      // Test API endpoint
      const apiTest = await fetch('/api/test').then(r => r.json())
      console.log('API Test:', apiTest)

      // Test environment variables
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
      }

      // Test database connection
      const dbTest = await fetch('/api/results').then(async r => {
        const data = await r.json()
        return { status: r.status, data }
      })

      setResults([
        { test: 'API Endpoint', status: 'Success', details: JSON.stringify(apiTest) },
        { test: 'Environment Variables', status: 'Info', details: JSON.stringify(envVars) },
        { test: 'Database Connection', status: dbTest.status === 200 ? 'Success' : 'Failed', details: JSON.stringify(dbTest) }
      ])
    } catch (error: any) {
      setResults([
        { test: 'Error', status: 'Failed', details: error.message }
      ])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-500">
            ← 返回首页
          </Link>
          <h1 className="mt-4 text-3xl font-bold">连接测试</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">测试结果</h2>
          {results.map((result, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="font-semibold">{result.test}</h3>
              <p className={`text-sm ${result.status === 'Success' ? 'text-green-600' : result.status === 'Failed' ? 'text-red-600' : 'text-gray-600'}`}>
                Status: {result.status}
              </p>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {result.details}
              </pre>
            </div>
          ))}
        </div>

        <div className="mt-6 bg-yellow-50 p-6 rounded">
          <h2 className="text-lg font-semibold mb-2">如果看到错误，请检查：</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>.env.local 文件是否正确配置</li>
            <li>Supabase 项目是否正常运行</li>
            <li>数据库表是否已创建</li>
            <li>RLS（行级安全）是否已禁用</li>
          </ol>
        </div>
      </div>
    </div>
  )
}