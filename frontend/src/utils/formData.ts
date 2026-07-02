type FormValue = string | number | boolean | File | null | undefined | FormValue[] | { [key: string]: FormValue }

function appendValue(formData: FormData, key: string, value: FormValue): void {
  if (value === null || value === undefined) return

  if (value instanceof File) {
    formData.append(key, value)
    return
  }

  if (typeof value === 'boolean') {
    formData.append(key, value ? '1' : '0')
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => appendValue(formData, `${key}[${index}]`, item))
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([nestedKey, nestedValue]) => {
      appendValue(formData, `${key}[${nestedKey}]`, nestedValue)
    })
    return
  }

  formData.append(key, String(value))
}

export function buildFormData<T extends object>(data: T, method?: 'PUT' | 'PATCH'): FormData {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => appendValue(formData, key, value as FormValue))
  if (method) {
    formData.append('_method', method)
  }
  return formData
}
