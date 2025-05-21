'use client'

import { useState } from 'react'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { DataTable } from '@/components/data-table'
import {
  Plus,
  Search,
  Download,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { formatDistanceToNow } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import TableSkeleton from '@/components/table-skeleton'
import { Patient } from '../types/patients'

export default function PatientsDataTable() {
  const [filterText, setFilterText] = useState('')

  const result = useLiveQuery<Patient>(
    `SELECT * FROM patients ORDER BY created_at DESC`,
  )
  const patients = result?.rows ?? []
  const isLoading = !result

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.first_name &&
        patient.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (patient.last_name &&
        patient.last_name.toLowerCase().includes(filterText.toLowerCase())) ||
      (patient.email &&
        patient.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (patient.phone &&
        patient.phone.toLowerCase().includes(filterText.toLowerCase())) ||
      (patient.address &&
        patient.address.toLowerCase().includes(filterText.toLowerCase())),
  )

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-amber-100 text-amber-800',
      'bg-rose-100 text-rose-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800',
    ]
    const hash = name
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  const calculateAge = (dateOfBirth: string) => {
    try {
      const birthDate = new Date(dateOfBirth)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--
      }
      return age
    } catch (error) {
      return 'Unknown'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch (error) {
      return 'Unknown'
    }
  }

  const columns: ColumnDef<Patient>[] = [
    {
      accessorKey: 'name',
      header: 'Patient',
      cell: ({ row }) => {
        const patient = row.original
        return (
          <div className="flex items-center gap-3 py-2">
            <Avatar
              className={
                getAvatarColor(
                  `${patient.first_name} ${patient.last_name}`,
                ).split(' ')[0]
              }
            >
              <AvatarFallback
                className={
                  getAvatarColor(
                    `${patient.first_name} ${patient.last_name}`,
                  ).split(' ')[1]
                }
              >
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {patient.first_name} {patient.last_name}
              </div>
              <div className="text-sm text-gray-500">{patient.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-gray-700">
            {calculateAge(row.original.date_of_birth)} years
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'date_of_birth',
      header: 'DOB',
      cell: ({ row }) => formatDate(row.original.date_of_birth),
    },
    {
      accessorKey: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div>
          <div>{row.original.phone || 'No phone'}</div>
          <div className="max-w-[200px] truncate text-xs text-gray-500">
            {row.original.address || 'No address'}
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Registered',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500">
          {formatTimeAgo(row.original.created_at)}
        </div>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit patient
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              View records
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">
              <Trash className="mr-2 h-4 w-4" />
              Delete patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Patients Directory
            </CardTitle>
            <CardDescription>
              Manage and view all registered patients
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs text-gray-700"
            >
              <Download className="mr-1 h-3.5 w-3.5" />
              Export
            </Button>
            <Button size="sm" className="h-8 px-2 text-xs">
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add Patient
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-y border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="h-10 py-2 pr-4 pl-9 text-sm"
                placeholder="Search patients..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex h-9 items-center gap-1 text-xs font-medium"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
              <Badge className="border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
                {filteredPatients.length} patients
              </Badge>
            </div>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} columns={6} className="p-6" />
        ) : (
          <DataTable columns={columns} data={filteredPatients} />
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-100 px-6 py-4 text-sm text-gray-500">
        Last updated just now
      </CardFooter>
    </Card>
  )
}
