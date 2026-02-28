const API_URL = 'http://localhost:3001/api' // Payload Admin port

async function seedLocations() {
  console.log('Logging into Payload CMS...')
  let token
  try {
    const loginRes = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@fathstore.com', password: 'fathstore' }),
    })
    if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`)
    const loginData = await loginRes.json()
    token = loginData.token
    console.log('Login successful.')
  } catch (err) {
    console.error('Failed to log in:', err.message)
    return
  }

  console.log('Seeding Singapore Location Data...')

  // Step 1: Create Province (Country level representation for SG in this context)
  console.log('-> Creating Province (Singapore)')
  const provinceRes = await fetch(`${API_URL}/provinces`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: 'Singapore', code: 'SG' }),
  })
  const provinceData = await provinceRes.json()
  const provinceId = provinceData.doc?.id
  console.log(provinceId ? `   Success: ID ${provinceId}` : `   Error: ${JSON.stringify(provinceData)}`)
  if (!provinceId) return;

  // Step 2: Create City (Region)
  console.log('-> Creating City (Central Region)')
  const cityRes = await fetch(`${API_URL}/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: 'Central Region', type: 'Kota', province: provinceId }),
  })
  const cityData = await cityRes.json()
  const cityId = cityData.doc?.id
  console.log(cityId ? `   Success: ID ${cityId}` : `   Error: ${JSON.stringify(cityData)}`)
  if (!cityId) return;

  // Step 3: Create District
  console.log('-> Creating District (Downtown Core)')
  const districtRes = await fetch(`${API_URL}/districts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: 'Downtown Core', city: cityId }),
  })
  const districtData = await districtRes.json()
  const districtId = districtData.doc?.id
  console.log(districtId ? `   Success: ID ${districtId}` : `   Error: ${JSON.stringify(districtData)}`)
  if (!districtId) return;

  // Step 4: Create Subdistrict
  console.log('-> Creating Subdistrict (Bugis)')
  const subdistrictRes = await fetch(`${API_URL}/subdistricts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name: 'Bugis', district: districtId, postalCode: '188065' }),
  })
  const subdistrictData = await subdistrictRes.json()
  const subdistrictId = subdistrictData.doc?.id
  console.log(subdistrictId ? `   Success: ID ${subdistrictId}` : `   Error: ${JSON.stringify(subdistrictData)}`)

  console.log('\n✅ Successfully Seeded Singapore Location Data.')
}

seedLocations()

