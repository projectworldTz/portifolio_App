import { useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const BASE_INPUT =
  'w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-indigo-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white'

interface FieldWrapperProps {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}

function FieldWrapper({ label, htmlFor, error, children }: FieldWrapperProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }

export function TextField({ label, error, id, className = '', ...props }: TextFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} error={error}>
      <input id={id} className={`${BASE_INPUT} ${className}`} {...props} />
    </FieldWrapper>
  )
}

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string }

export function TextareaField({ label, error, id, className = '', ...props }: TextareaFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} error={error}>
      <textarea id={id} className={`${BASE_INPUT} ${className}`} {...props} />
    </FieldWrapper>
  )
}

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; children: ReactNode }

export function SelectField({ label, error, id, className = '', children, ...props }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} htmlFor={id!} error={error}>
      <select id={id} className={`${BASE_INPUT} ${className}`} {...props}>
        {children}
      </select>
    </FieldWrapper>
  )
}

interface CheckboxFieldProps {
  label: string
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function CheckboxField({ label, id, checked, onChange }: CheckboxFieldProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500 dark:border-neutral-600"
      />
      {label}
    </label>
  )
}

interface FileFieldProps {
  label: string
  id: string
  onChange: (file: File | null) => void
  currentUrl?: string | null
  accept?: string
}

export function FileField({ label, id, onChange, currentUrl, accept = 'image/*' }: FileFieldProps) {
  const [fileError, setFileError] = useState('')

  const handleFileChange = (file: File | null) => {
    if (file && file.size > 10 * 1024 * 1024) {
      setFileError('Choose an image smaller than 10 MB.')
      onChange(null)
      return
    }
    setFileError('')
    onChange(file)
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
      </label>
      {currentUrl && (
        <img src={currentUrl} alt="" className="mb-2 h-20 w-20 rounded-lg object-cover" />
      )}
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100 dark:text-neutral-300 dark:file:bg-indigo-500/10 dark:file:text-indigo-300"
      />
      {fileError && <p className="mt-1.5 text-xs font-medium text-red-600">{fileError}</p>}
    </div>
  )
}
