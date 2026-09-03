import axios from 'axios'

export function getErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
    if (data?.errors) {
      const firstError = Object.values(data.errors)[0]?.[0]
      if (firstError) return firstError
    }
    if (data?.message) return data.message
    if (err.response?.status === 413) {
      return 'The selected images are too large for one upload. Use images under 10 MB each and keep the complete upload under 55 MB.'
    }
    if (!err.response) {
      return 'The server could not be reached. Check that the backend and database are running, then try again.'
    }
  }
  return fallback
}
