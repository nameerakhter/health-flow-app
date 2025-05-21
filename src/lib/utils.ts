import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNow } from 'date-fns'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const PHONE_NUMBER_REGEX = /^\d{10}$/
export const DATE_OF_BIRTH_REGEX = /^\d{2}\/\d{2}\/\d{4}$/

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

export function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-amber-100 text-amber-800',
    'bg-rose-100 text-rose-800',
    'bg-indigo-100 text-indigo-800',
    'bg-cyan-100 text-cyan-800',
  ]
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export function calculateAge(dateOfBirth: string) {
  try {
    const birthDate = dayjs(dateOfBirth)
    if (!birthDate.isValid()) return 'Unknown'
    const today = dayjs()
    let age = today.year() - birthDate.year()
    if (
      today.month() < birthDate.month() ||
      (today.month() === birthDate.month() && today.date() < birthDate.date())
    ) {
      age--
    }
    return age
  } catch {
    throw new Error('Invalid date of birth')
  }
}

export function getInitials(firstName: string, lastName: string) {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

export function formatDate(dateString: string) {
  try {
    const date = dayjs(dateString)
    if (!date.isValid()) return 'Invalid date'
    return date.format('MMM D, YYYY')
  } catch {
    throw new Error('Invalid date')
  }
}

export function formatTimeAgo(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch {
    throw new Error('Invalid date')
  }
}
