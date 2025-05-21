import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { match } from 'ts-pattern'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const PAGE_SIZES = [5, 10, 20, 30, 40, 50]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnsVisibilityState?: VisibilityState
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  getRowId?: (data: TData) => string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  columnsVisibilityState,
  rowSelection = {},
  onRowSelectionChange,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange,
    getRowId,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    initialState: {
      columnVisibility: columnsVisibilityState,
    },
  })
  const { pageIndex, pageSize } = table.getState().pagination
  const totalPages = table.getPageOptions().length

  const totalRows = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min(startRow + pageSize - 1, totalRows)

  return (
    <div className="w-full">
      <div className="relative w-full overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-left whitespace-nowrap text-white"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-left whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col space-y-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="w-fit">
          <Select
            value={pageSize.toString()}
            onValueChange={(pageCountSelected) => {
              table.setPageSize(Number.parseInt(pageCountSelected, 10))
            }}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((_pageSize) => {
                return (
                  <SelectItem value={_pageSize.toString()} key={_pageSize}>
                    {_pageSize} / page
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="text-muted-foreground mt-2 text-sm">
          Showing {startRow}–{endRow} of {totalRows} rows
        </div>

        <Pagination className="w-full sm:w-auto">
          <PaginationContent className="flex-wrap justify-center sm:justify-end">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => {
                  table.previousPage()
                }}
              />
            </PaginationItem>
            {getPages(pageIndex + 1, totalPages).map((pageItem, index) => {
              return match(pageItem)
                .returnType<React.ReactNode>()
                .with({ type: 'item' }, ({ value }) => {
                  return (
                    <PaginationItem key={`page-${value}`}>
                      <PaginationLink
                        onClick={() => {
                          table.setPageIndex(value - 1)
                        }}
                        isActive={pageIndex + 1 === value}
                      >
                        {value}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })
                .with({ type: 'ellipsis' }, () => {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                })
                .exhaustive()
            })}
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  table.nextPage()
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
type PageData =
  | {
      type: 'item'
      value: number
    }
  | {
      type: 'ellipsis'
    }

export function getPages(
  activePage: number,
  totalPages: number,
  pageRangeDisplayed: number = 2,
  boundaryPageButtons: number = 1,
): PageData[] {
  const items: PageData[] = []

  if (totalPages <= pageRangeDisplayed) {
    for (let page = 1; page <= totalPages; page++) {
      items.push({
        type: 'item',
        value: page,
      })
    }
  } else {
    // Number of buttons to render on the left side of selected button
    let leftSide = pageRangeDisplayed / 2

    // Number of buttons to render on the right side of selected button
    let rightSide = pageRangeDisplayed - leftSide

    // If the selected page index is on the default right side of the pagination,
    // we consider that the new right side is made up of it (= only one break element).
    // If the selected page index is on the default left side of the pagination,
    // we consider that the new left side is made up of it (= only one break element).
    if (activePage > totalPages - pageRangeDisplayed / 2) {
      rightSide = totalPages - activePage
      leftSide = pageRangeDisplayed - rightSide
    } else if (activePage < pageRangeDisplayed / 2) {
      leftSide = activePage
      rightSide = pageRangeDisplayed - leftSide
    }

    for (let page = 1; page <= totalPages; page++) {
      // If the page index is lower than
      // the number of boundary buttons defined,
      // the page has to be displayed on the left side of
      // the pagination.
      if (page <= boundaryPageButtons) {
        items.push({
          type: 'item',
          value: page,
        })
        continue
      }

      // If the page index is greater than the total pages
      // minus the number of boundary buttons defined,
      // the page has to be displayed on the right side of the pagination.
      if (page > totalPages - boundaryPageButtons) {
        items.push({
          type: 'item',
          value: page,
        })
        continue
      }

      // If the page index is near the activePage page index
      // and inside the defined range (pageRangeDisplayed)
      // we have to display it (it will create the center
      // part of the pagination).
      if (page >= activePage - leftSide && page <= activePage + rightSide) {
        items.push({
          type: 'item',
          value: page,
        })
        continue
      }

      // If the page index doesn't meet any of the conditions above,
      // we check if the last item of the current "items" array
      // is a break element. If not, we add a break element, else,
      // we do nothing (because we don't want to display the page).
      if (items[items.length - 1].type !== 'ellipsis') {
        items.push({
          type: 'ellipsis',
        })
      }
    }
  }
  return items
}
