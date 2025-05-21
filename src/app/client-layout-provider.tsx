'use client'

import { PGliteProvider } from '@electric-sql/pglite-react'
import { PGliteWorker } from '@electric-sql/pglite/worker'
import { live } from '@electric-sql/pglite/live'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

export function ClientLayoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [db, setDb] = useState<any>(null)

  useEffect(() => {
    const initDb = async () => {
      const worker = new Worker(
        new URL('../../public/pglite-worker.js', import.meta.url),
        { type: 'module' },
      )

      const db = await PGliteWorker.create(worker, {
        extensions: { live },
      })

      setDb(db)
    }
    initDb()
  }, [])

  if (!db) {
    return <Spinner />
  }

  return <PGliteProvider db={db}>{children}</PGliteProvider>
}
