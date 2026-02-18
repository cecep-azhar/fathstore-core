
import { getPayload } from 'payload'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const seed = async () => {
  const payload = await getPayload({ config })

  console.log('Seeding Pages...')

  // 1. Upload Images
  const uploadImage = async (filename: string, alt: string) => {
    // Check if image exists
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: { equals: filename },
      },
    })

    if (existing.docs.length > 0) {
      console.log(`Image ${filename} already exists.`)
      return existing.docs[0]
    }

    const filePath = path.resolve(__dirname, `../public/seed/${filename}`)
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`)
        return null
    }

    const file = fs.readFileSync(filePath)

    console.log(`Uploading ${filename}...`)
    return await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      file: {
        data: file,
        name: filename,
        mimetype: 'image/jpeg',
        size: file.length,
      },
    })
  }

  const homeHero = await uploadImage('hero-home.jpg', 'Home Hero Image')
  const aboutHero = await uploadImage('hero-about.jpg', 'About Hero Image')

  if (!homeHero || !aboutHero) {
      console.error("Failed to upload images. Skipping page creation.")
      process.exit(1)
  }

  // 2. Create Home Page
  const existingHome = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
    },
  })

  if (existingHome.docs.length === 0) {
    console.log('Creating Home Page...')
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Home',
        slug: 'home',
        layout: [
          {
            blockType: 'hero',
            headline: 'We Exortive Passion',
            subHeadline: 'Discover our premium collection designed for performance and style.',
            backgroundImage: homeHero.id,
            buttons: [
              { label: 'Shop Now', url: '/products', type: 'primary' },
              { label: 'Learn More', url: '/about', type: 'secondary' },
            ],
          },
          {
            blockType: 'featuredProducts',
            headline: 'New Arrivals',
            subHeadline: 'Our latest collection just dropped.',
            products: [], 
          },
        ],
      },
    })
  } else {
    console.log('Home Page already exists.')
  }

  // 3. Create About Page
  const existingAbout = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'about' },
    },
  })

  if (existingAbout.docs.length === 0) {
    console.log('Creating About Page...')
    await payload.create({
      collection: 'pages',
      data: {
        title: 'About Us',
        slug: 'about',
        layout: [
          {
            blockType: 'hero',
            headline: 'Our Story',
            subHeadline: 'Driven by passion, defined by quality. We are redefining what it means to wear your ambition.',
            backgroundImage: aboutHero.id,
            buttons: [],
          },
          {
            blockType: 'content',
            richText: {
              root: {
                type: 'root',
                children: [
                   {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Founded in 2024, Exortive began with a simple idea: that clothing should be more than just fabric—it should be a statement. We combine modern aesthetics with timeless craftsmanship to create pieces that stand out.',
                        version: 1,
                        mode: 'normal',
                        format: 0,
                        style: ''
                      }
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1
                   }
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1
              }
            },
            layout: 'fullWidth',
          },
          {
            blockType: 'stats',
            headline: 'Our Impact',
            statItems: [
              { value: '10k+', label: 'Happy Customers' },
              { value: '100%', label: 'Quality Guarantee' },
              { value: '24/7', label: 'Customer Support' },
            ],
          },
        ],
      },
    })
  } else {
    console.log('About Page already exists.')
  }

  console.log('Seeding complete!')
  process.exit(0)
}

seed()
