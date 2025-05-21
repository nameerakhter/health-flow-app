import { DATE_OF_BIRTH_REGEX, PHONE_NUMBER_REGEX } from '@/lib/utils'
import { z } from 'zod'

export const patientFormSchema = z.object({
  first_name: z.string().min(3, { message: 'First name is required' }),
  last_name: z.string().min(3, { message: 'Last name is required' }),
  date_of_birth: z.string().regex(DATE_OF_BIRTH_REGEX, {
    message: 'Date of birth must be in MM/DD/YYYY format',
  }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().regex(PHONE_NUMBER_REGEX, {
    message: 'Phone number must be 10 digits only',
  }),
  address: z.string().min(3, { message: 'Address is required' }),
})
