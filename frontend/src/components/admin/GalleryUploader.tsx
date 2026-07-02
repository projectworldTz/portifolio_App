import { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa6'

export interface ExistingImage {
  id: number
  url: string
  alt_text: string | null
}

export interface NewImage {
  file: File
  alt_text: string
  previewUrl: string
}

interface GalleryUploaderProps {
  existingImages: ExistingImage[]
  onDeleteExisting: (imageId: number) => void
  newImages: NewImage[]
  onChangeNewImages: (images: NewImage[]) => void
}

export default function GalleryUploader({
  existingImages,
  onDeleteExisting,
  newImages,
  onChangeNewImages,
}: GalleryUploaderProps) {
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)

  const handleAddFiles = (files: FileList | null) => {
    if (!files) return
    const additions: NewImage[] = Array.from(files).map((file) => ({
      file,
      alt_text: '',
      previewUrl: URL.createObjectURL(file),
    }))
    onChangeNewImages([...newImages, ...additions])
  }

  const updateAltText = (index: number, altText: string) => {
    onChangeNewImages(newImages.map((img, i) => (i === index ? { ...img, alt_text: altText } : img)))
  }

  const removeNewImage = (index: number) => {
    onChangeNewImages(newImages.filter((_, i) => i !== index))
  }

  const handleDeleteExisting = async (imageId: number) => {
    setIsDeletingId(imageId)
    try {
      await onDeleteExisting(imageId)
    } finally {
      setIsDeletingId(null)
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Gallery Images</label>

      {existingImages.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {existingImages.map((image) => (
            <div key={image.id} className="group relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800">
              <img src={image.url} alt={image.alt_text ?? ''} className="aspect-video w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDeleteExisting(image.id)}
                disabled={isDeletingId === image.id}
                aria-label="Delete image"
                className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-60"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {newImages.length > 0 && (
        <div className="mb-4 space-y-3">
          {newImages.map((image, index) => (
            <div key={image.previewUrl} className="flex items-center gap-3 rounded-lg border border-neutral-200 p-2 dark:border-neutral-800">
              <img src={image.previewUrl} alt="" className="h-14 w-20 rounded object-cover" />
              <input
                type="text"
                placeholder="Alt text (optional)"
                value={image.alt_text}
                onChange={(e) => updateAltText(index, e.target.value)}
                className="flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => removeNewImage(index)}
                aria-label="Remove"
                className="rounded-lg p-2 text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-500/10"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300">
        <FaPlus size={12} /> Add Images
        <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleAddFiles(e.target.files)} />
      </label>
    </div>
  )
}
