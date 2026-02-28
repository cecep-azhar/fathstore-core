const API_URL = 'http://localhost:3001/api'

const DUMMY_PRODUCTS = [
  {
    title: 'Exortive Pro Windbreaker',
    description: 'A premium windbreaker designed for optimal performance in harsh conditions.',
    price: 120, // SGD
    compareAtPrice: 150,
    status: 'published',
    stock: 50,
  },
  {
    title: 'Exortive Essential Tee',
    description: 'High-quality cotton blend t-shirt for everyday wear.',
    price: 35, // SGD
    compareAtPrice: 45,
    status: 'published',
    stock: 200,
  },
  {
    title: 'Exortive Performance Shorts',
    description: 'Lightweight shorts with moisture-wicking technology.',
    price: 45, // SGD
    status: 'published',
    stock: 120,
  },
  {
    title: 'Exortive Alpha Hoodie',
    description: 'Heavyweight fleece hoodie for maximum comfort and warmth.',
    price: 85, // SGD
    compareAtPrice: 100,
    status: 'published',
    stock: 75,
  },
  {
    title: 'Exortive Compression Leggings',
    description: 'Engineered for recovery and high-intensity workouts.',
    price: 60, // SGD
    status: 'published',
    stock: 90,
  },
  {
    title: 'Exortive Track Jacket',
    description: 'Classic retro-style track jacket with modern materials.',
    price: 95, // SGD
    compareAtPrice: 110,
    status: 'published',
    stock: 40,
  },
  {
    title: 'Exortive Training Backpack',
    description: 'Durable backpack with multiple compartments for gym essentials.',
    price: 75, // SGD
    status: 'published',
    stock: 60,
  },
  {
    title: 'Exortive Elite Running Shoes',
    description: 'Next-generation footwear designed for marathon runners.',
    price: 180, // SGD
    compareAtPrice: 200,
    status: 'published',
    stock: 30,
  },
  {
    title: 'Exortive Classic Cap',
    description: 'Adjustable athletic cap with embroidered logo.',
    price: 25, // SGD
    status: 'published',
    stock: 150,
  },
  {
    title: 'Exortive Impact Sports Bra',
    description: 'High-support sports bra for maximum confidence during training.',
    price: 50, // SGD
    compareAtPrice: 65,
    status: 'published',
    stock: 100,
  },
]

async function seed() {
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

  console.log('Fetching existing categories...')
  let categoryIds = []
  try {
    const catRes = await fetch(`${API_URL}/categories?limit=2`, {
      headers: { Authorization: `JWT ${token}` },
    })
    const catData = await catRes.json()
    if (catData.docs.length > 0) {
      categoryIds = catData.docs.map(c => c.id)
      console.log(`Found ${categoryIds.length} categories.`)
    } else {
      console.log('No categories found. Creating a default category...')
      const newCatRes = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify({ name: 'Apparel', slug: 'apparel' }),
      })
      const newCatData = await newCatRes.json()
      categoryIds.push(newCatData.doc.id)
    }
  } catch (err) {
    console.warn('Failed to fetch/create categories, continuing without them.')
  }

  console.log('Seeding products...')
  for (const product of DUMMY_PRODUCTS) {
    try {
      const payload = { ...product }
      if (categoryIds.length > 0) {
        payload.categories = [categoryIds[0]] // Assign first category
      }

      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        console.log(`Created: ${product.title}`)
      } else {
        const errorText = await res.text()
        console.error(`Failed to create ${product.title}: ${res.statusText} - ${errorText}`)
      }
    } catch (err) {
      console.error(`Error on ${product.title}:`, err.message)
    }
  }

  console.log('Seed completed.')
}

seed()
