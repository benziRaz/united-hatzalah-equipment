"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"

interface FileUploadProps {
  onFileChange: (file: File | null) => void
  label: string
  accept?: string
  maxSize?: number // בבייטים
}

export function FileUpload({ onFileChange, label, accept = "image/*", maxSize = 5 * 1024 * 1024 }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null

    if (!selectedFile) {
      setFile(null)
      setPreview(null)
      onFileChange(null)
      return
    }

    // בדיקת גודל הקובץ
    if (selectedFile.size > maxSize) {
      setError(`הקובץ גדול מדי. הגודל המקסימלי הוא ${maxSize / 1024 / 1024} MB`)
      return
    }

    setError(null)
    setFile(selectedFile)
    onFileChange(selectedFile)

    // יצירת תצוגה מקדימה לתמונה
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
    setError(null)
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div className="flex flex-col items-center gap-2">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept={accept} className="hidden" />

        {!file && (
          <Button
            type="button"
            variant="outline"
            onClick={handleButtonClick}
            className="w-full h-24 flex flex-col gap-1"
          >
            <Upload className="h-5 w-5" />
            <span className="text-xs">לחץ להעלאת קובץ</span>
          </Button>
        )}

        {file && (
          <div className="relative w-full border rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="truncate text-sm">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {preview && (
              <div className="mt-2 flex justify-center">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="תצוגה מקדימה"
                  className="max-h-32 max-w-full object-contain rounded-md"
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-destructive text-xs">{error}</p>}
      </div>
    </div>
  )
}
