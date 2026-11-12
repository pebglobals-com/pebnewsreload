import { ApiError } from './api'

export interface FormErrorState {
  message: string | null
  fields: Record<string, string[]>
}

export function toFormError(
  error: unknown,
  fallbackMessage: string,
): FormErrorState {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      fields: error.errors ?? {},
    }
  }

  if (error instanceof Error) {
    return { message: error.message, fields: {} }
  }

  return { message: fallbackMessage, fields: {} }
}
