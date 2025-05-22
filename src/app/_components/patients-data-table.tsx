'use client'

import { useState } from 'react'
import { useLiveQuery } from '@electric-sql/pglite-react'
import { DataTable } from '@/components/data-table'
import { Search, Filter, MoreHorizontal, Trash } from 'lucide-react'
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
import { ColumnDef } from '@tanstack/react-table'
import TableSkeleton from '@/components/table-skeleton'
import { Patient } from '../types/patients'
import {
  calculateAge,
  formatDate,
  formatTimeAgo,
  getAvatarColor,
  getInitials,
} from '@/lib/utils'
import { matchSorter } from 'match-sorter'

export default function PatientsDataTable() {
  const [filterText, setFilterText] = useState('')

  const result = useLiveQuery<Patient>(
    `SELECT * FROM patients ORDER BY created_at DESC`,
  )
  const patients = result?.rows ?? []
  const isLoading = !result

  const globalTableFilter = matchSorter(patients, filterText, {
    keys: ['first_name', 'last_name', 'email', 'phone', 'address'],
    threshold: matchSorter.rankings.CONTAINS,
  })

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
          <div>{row.original.phone}</div>
          <div className="max-w-[200px] truncate text-xs text-gray-500">
            {row.original.address}
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
      header: 'Actions',
      cell: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-rose-600">
              <Trash className="mr-2 size-4" />
              Delete patient
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <Card className="border-gray-200 p-6 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              Patients Directory
            </CardTitle>
            <CardDescription>View all registered patients</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-y border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="h-10 py-2 pr-4 pl-9 text-sm"
                placeholder="Search patients..."
                value={filterText}
                type="search"
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
            <Badge className="border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100">
              {globalTableFilter.length} patients
            </Badge>
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} columns={6} className="p-6" />
        ) : (
          <DataTable columns={columns} data={globalTableFilter} />
        )}
      </CardContent>
    </Card>
  )
}
