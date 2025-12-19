'use client'

import { useState } from 'react'

interface FileUploaderProps {
  title: string
  description: string
  accept: string
  onFileSelect: (file: File) => void
  isLoading?: boolean
}

export default function FileUploader({
  title,
  description,
  accept,
  onFileSelect,
  isLoading = false
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    setSelectedFile(file)
    onFileSelect(file)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center
          ${isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileInput}
          disabled={isLoading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <div className="space-y-2">
          <div className="text-3xl">
            {isLoading ? '⏳' : '📁'}
          </div>
          {selectedFile ? (
            <div>
              <p className="text-sm font-medium text-green-600">
                已选择: {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                拖拽文件到此处或点击选择
              </p>
              <p className="text-xs text-gray-500">
                支持 {accept} 格式
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}