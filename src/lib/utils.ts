import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PHONE_NUMBER_REGEX = /^\d{10}$/

export function getErrorMessage(
  error: unknown,
  defaultMessage: string = 'Something went wrong. Please try again.',
) {
  let message = defaultMessage
  if (error instanceof Error) {
    message = error.message
  }

  return message
}
