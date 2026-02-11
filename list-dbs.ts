import postgres from 'postgres'

async function listDbs() {
  const uri = 'postgres://postgres:password@localhost:5432/postgres'
  const sql = postgres(uri)

  try {
    const dbs = await sql`SELECT datname FROM pg_database`
    console.log(
      'Databases:',
      dbs.map((d) => d.datname)
    )
  } catch (err: any) {
    console.error('Error listing databases:', err.message)
  } finally {
    await sql.end()
  }
}

listDbs()
