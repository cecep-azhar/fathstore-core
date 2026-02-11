import postgres from 'postgres'

async function checkTables() {
  const uri = 'postgres://postgres:password@localhost:5432/lmswijd'
  const sql = postgres(uri)

  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('Tables in lmswijd:', tables)
  } catch (err: any) {
    console.error('Error checking tables:', err.message)
  } finally {
    await sql.end()
  }
}

checkTables()
