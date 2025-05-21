import { Skeleton } from '@/components/ui/skeleton'

type TableSkeletonProps = {
  rows: number
  columns: number
  className?: string
}

export default function TableSkeleton({
  rows,
  columns,
  className,
}: TableSkeletonProps) {
  return (
    <div className={`flex w-full flex-col justify-start gap-4 ${className}`}>
      <div className="flex items-center py-4">
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
      <div className="rounded-md">
        {[...Array(rows)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="hover:bg-muted/50 flex items-center border-b last:border-b-0"
          >
            {[...Array(columns)].map((_, colIndex) => (
              <div key={colIndex} className="flex-1 p-4">
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
