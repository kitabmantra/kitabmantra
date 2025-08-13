"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"
interface ImageUploadProps {
  onImagesUploaded: (files: File[]) => void
  onGenerateFromImages: (files: File[], type: "multiple") => void
  isGenerating?: boolean
  mode: "multiple"
}

export function ImageUpload({ onImagesUploaded, onGenerateFromImages, isGenerating, mode }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([])

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    const imageFiles = Array.from(files).filter(
      (file) =>
        file.type.startsWith("image/") && ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type),
    )

    if (imageFiles.length === 0) {
      toast.error("Please select valid image files (JPEG, PNG, GIF, WebP)")
      return
    }

    setUploadedImages((prev) => [...prev, ...imageFiles])
    onImagesUploaded(imageFiles)
    toast.success(`${imageFiles.length} image(s) uploaded successfully`)
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleGenerate = () => {
    if (uploadedImages.length === 0) {
      toast.error("Please upload at least one image")
      return
    }
    onGenerateFromImages(uploadedImages, mode)
    setUploadedImages([])
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="border-2 border-dashed border-border rounded-lg p-6">
          <div className="text-center">
            <input
              type="file"
              multiple={true}
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-foreground mb-2">Upload images to generate questions</p>
              <p className="text-xs text-muted-foreground">Supports JPEG, PNG, GIF, WebP</p>
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</span>
                <Button onClick={handleGenerate} disabled={isGenerating} size="sm">
                  {isGenerating
                    ? "Generating..."
                    : `Generate ${uploadedImages.length} Questions`}
                </Button>
              </div>
              <div className="grid gap-3 grid-cols-3">
                {uploadedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                      width={80}
                      height={80}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
