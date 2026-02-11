import postgres from 'postgres'

async function testConnection(uri: string, name: string) {
  console.log(`Testing connection (${name}):`, uri)

  const sql = postgres(uri, { connect_timeout: 5 })

  try {
    const result = await sql`SELECT 1 as connected`
    console.log(`[${name}] Successfully connected!`, result)
    return true
  } catch (err: any) {
    console.error(`[${name}] Connection failed:`, err.message)
    return false
  } finally {
    await sql.end()
  }
}

async function runTests() {
  const uri1 = 'postgres://postgres:password@localhost:5432/lmswijad'
  const uri2 = 'postgres://postgres:password@localhost:5432/lmswijd'

  await testConnection(uri1, '.env version (lmswijad)')
  await testConnection(uri2, '.env.local version (lmswijd)')
}

runTests()
