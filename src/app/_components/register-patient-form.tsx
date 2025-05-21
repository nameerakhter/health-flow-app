'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientFormSchema } from '@/app/validation/schema'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { usePGlite } from '@electric-sql/pglite-react'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  CalendarIcon,
  UserCircle,
  Mail,
  Phone,
  Home,
  Heart,
  Shield,
  ArrowRight,
} from 'lucide-react'
import Link from 'next/link'

export default function RegisterPatientForm() {
  const db = usePGlite()
  const form = useForm<z.infer<typeof patientFormSchema>>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      date_of_birth: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  async function onSubmit(data: z.infer<typeof patientFormSchema>) {
    try {
      await db.query(
        `INSERT INTO patients (
          first_name,
          last_name,
          date_of_birth,
          email,
          phone,
          address
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,
        [
          data.first_name,
          data.last_name,
          data.date_of_birth,
          data.email,
          data.phone,
          data.address,
        ],
      )

      toast.success('Patient registered successfully')
      form.reset()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 p-4 md:p-8">
      <Card className="w-full max-w-3xl overflow-hidden border-0 bg-white shadow-xl">
        <div className="absolute top-0 left-0 h-2 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <div className="flex flex-col md:flex-row">
          <div className="relative hidden w-1/3 bg-gradient-to-br from-blue-600 to-indigo-800 text-white md:block">
            <div className="relative z-10 flex h-full flex-col p-8">
              <div className="mb-8">
                <Avatar className="size-12 border-2 border-white/20">
                  <AvatarImage
                    src="https://cdn-icons-png.flaticon.com/512/3774/3774079.png"
                    alt="Healthcare"
                  />
                  <AvatarFallback>HC</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-semibold text-white">
                  Medical Portal
                </h3>
                <p className="mt-1 text-sm text-blue-200">
                  Patient registration
                </p>
              </div>

              <div className="flex-grow space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-blue-100">
                    <Shield size={20} />
                    <span className="text-sm">Private and secure</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-100">
                    <Heart size={20} />
                    <span className="text-sm">Personalized healthcare</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-100">
                    <ArrowRight size={20} />
                    <span className="text-sm">Easy appointment booking</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Separator className="mb-6 bg-white/20" />
                <p className="text-sm text-blue-200">
                  Your health is our priority. We are here to provide the best
                  care possible.
                </p>
              </div>
            </div>
          </div>

          <div className="p-0 md:w-2/3">
            <CardHeader className="px-8 pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">
                Patient Registration
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your information to create your patient profile
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                            <UserCircle className="size-4 text-blue-500" />
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                              placeholder="John"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                            <UserCircle className="size-4 text-blue-500" />
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                              placeholder="Doe"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="date_of_birth"
                    render={({ field }) => {
                      function handleInput(
                        e: React.ChangeEvent<HTMLInputElement>,
                      ) {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length > 8) value = value.slice(0, 8)
                        let formatted = value
                        if (value.length > 4) {
                          formatted = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`
                        } else if (value.length > 2) {
                          formatted = `${value.slice(0, 2)}/${value.slice(2)}`
                        }
                        field.onChange(formatted)
                      }

                      return (
                        <FormItem className="space-y-2">
                          <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                            <CalendarIcon className="size-4 text-blue-500" />
                            Date of Birth
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                value={field.value || ''}
                                onChange={handleInput}
                                type="text"
                                className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                                placeholder="MM/DD/YYYY"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                          <Mail className="size-4 text-blue-500" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                            placeholder="john.doe@example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                          <Phone className="size-4 text-blue-500" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                            placeholder="(123) 456-7890"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                          <Home className="size-4 text-blue-500" />
                          Full Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="rounded-md border-gray-200 focus-visible:ring-blue-500"
                            placeholder="123 Main St, City, State, Zip"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Complete Registration
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex items-center justify-between px-8 pt-2 pb-8">
              <Link
                href="/patient-data"
                className="text-blue-600 hover:underline"
              >
                View Patient List
              </Link>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}
