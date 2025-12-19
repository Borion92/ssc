'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function DebugUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<any>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null)
  }

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/salaries', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      setResult({
        status: response.status,
        data: data,
        ok: response.ok
      })
    } catch (error: any) {
      setResult({
        error: error.message
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          ← 返回首页
        </Link>

        <h1 className="mt-4 text-3xl font-bold">调试上传</h1>

        <div className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择文件
            </label>
            <input
              type="file"
              onChange={handleFile}
              accept=".xlsx,.xls"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            上传
          </button>

          {result && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold mb-2">结果:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
          <h2 className="font-semibold mb-2">文件格式要求:</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>支持 .xlsx 和 .xls 格式</li>
            <li>列顺序: employee_id, employee_name, month, salary_amount</li>
            <li>month 格式: 202401, 202402 等</li>
            <li>第一行可以是表头</li>
          </ul>
        </div>
      </div>
    </div>
  )
}