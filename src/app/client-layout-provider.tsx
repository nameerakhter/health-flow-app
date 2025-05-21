'use client'

import { PGliteProvider } from '@electric-sql/pglite-react'
import { PGlite } from '@electric-sql/pglite'
import { live, LiveNamespace } from '@electric-sql/pglite/live'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

type PGliteWithLive = PGlite & { live: LiveNamespace }

async function initDatabase(db: PGliteWithLive) {
  await db.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      date_of_birth DATE NOT NULL,
      email VARCHAR(255),
      phone VARCHAR(20),
      address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

export function ClientLayoutProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [db, setDb] = useState<PGliteWithLive | null>(null)

  useEffect(() => {
    const initDb = async () => {
      const database = (await PGlite.create({
        extensions: { live },
        dataDir: 'idb://my-pg-data',
      })) as PGliteWithLive

      await initDatabase(database)

      setDb(database)
    }
    initDb()
  }, [])

  if (!db) {
    return <Spinner />
  }

  return <PGliteProvider db={db}>{children}</PGliteProvider>
}
