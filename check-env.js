const dotenv = require('dotenv')
const path = require('path')

// Next.js loads .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

console.log('DATABASE_URI:', process.env.DATABASE_URI)
