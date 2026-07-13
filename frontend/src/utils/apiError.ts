import axios from 'axios'

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0]
      if (firstError) return firstError
    }
    if (data?.message) return data.message
  }
  return fallback
}
