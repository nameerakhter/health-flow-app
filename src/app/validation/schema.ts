import { PHONE_NUMBER_REGEX } from '@/lib/utils'
import { z } from 'zod'

export const patientFormSchema = z.object({
  first_name: z.string().min(1, { message: 'First name is required' }),
  last_name: z.string().min(1, { message: 'Last name is required' }),
  date_of_birth: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'Invalid date of birth',
  }),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  phone: z
    .string()
    .regex(PHONE_NUMBER_REGEX, { message: 'Invalid phone number' })
    .optional(),
  address: z.string().min(1, { message: 'Address is required' }).optional(),
})
