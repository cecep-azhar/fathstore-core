// @ts-nocheck

/**
 * seed-sample-transactions.ts
 * ---------------------------
 * Script untuk mengisi sample transactions dengan berbagai payment methods.
 * Jalankan dengan: pnpm tsx scripts/seed-sample-transactions.ts
 */

import { getPayload } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

import config from '../payload.config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ─────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FS-${timestamp}-${random}`
}

function getRandomDate(startDate: Date, endDate: Date): Date {
  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()))
}

// ─────────────────────────────────────────────────────────────
// MAIN SEED
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  const payload = await getPayload({ config })

  console.log('\n🎯 FathStore Sample Transactions Seeding\n')

  // Fetch existing data
  console.log('[Setup] Fetching existing users and products...')

  const usersResult = await payload.find({
    collection: 'users',
    limit: 100,
  })
  const users = usersResult.docs
  console.log(`  ✔ Found ${users.length} users`)

  const productsResult = await payload.find({
    collection: 'products',
    limit: 100,
  })
  const products = productsResult.docs
  console.log(`  ✔ Found ${products.length} products`)

  const banksResult = await payload.find({
    collection: 'banks',
    limit: 100,
  })
  const banks = banksResult.docs
  console.log(`  ✔ Found ${banks.length} banks`)

  if (users.length === 0) {
    console.error('❌ No users found. Please run seed-master-data.ts first.')
    process.exit(1)
  }

  if (products.length === 0) {
    console.error('❌ No products found. Please run seed-master-data.ts first.')
    process.exit(1)
  }

  // ─── CREATE ADDITIONAL SAMPLE CUSTOMERS ──────────────────
  console.log('\n[Users] Creating additional sample customers...')

  const sampleCustomers = [
    {
      email: 'customer1@example.com',
      name: 'Ahmad Riyanto',
      phone: '+65 9123 4567',
      addresses: [
        {
          label: 'home' as const,
          fullName: 'Ahmad Riyanto',
          street: '123 Clementi Road #15-01, Singapore 129742',
          city: 'Singapore',
          province: '',
          postalCode: '129742',
        },
      ],
    },
    {
      email: 'customer2@example.com',
      name: 'Sarah Wong',
      phone: '+65 8765 4321',
      addresses: [
        {
          label: 'home' as const,
          fullName: 'Sarah Wong',
          street: '456 Kallang Road #08-02, Singapore 108282',
          city: 'Singapore',
          province: '',
          postalCode: '108282',
        },
      ],
    },
    {
      email: 'customer3@example.com',
      name: 'Rajesh Kumar',
      phone: '+65 8234 5678',
      addresses: [
        {
          label: 'home' as const,
          fullName: 'Rajesh Kumar',
          street: '789 Bedok Road #12-03, Singapore 429234',
          city: 'Singapore',
          province: '',
          postalCode: '429234',
        },
      ],
    },
    {
      email: 'customer4@example.com',
      name: 'Lisa Chen',
      phone: '+65 9876 5432',
      addresses: [
        {
          label: 'home' as const,
          fullName: 'Lisa Chen',
          street: '321 Marina Bay #20-05, Singapore 018956',
          city: 'Singapore',
          province: '',
          postalCode: '018956',
        },
      ],
    },
    {
      email: 'customer5@example.com',
      name: 'Mohammad Husein',
      phone: '+65 8901 2345',
      addresses: [
        {
          label: 'home' as const,
          fullName: 'Mohammad Husein',
          street: '654 Bukit Merah #06-07, Singapore 150654',
          city: 'Singapore',
          province: '',
          postalCode: '150654',
        },
      ],
    },
  ]

  const createdCustomers: any[] = []
  for (const customer of sampleCustomers) {
    try {
      const existing = await payload.find({
        collection: 'users',
        where: { email: { equals: customer.email } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`  ↳ [skip] customer ${customer.email} already exists`)
        createdCustomers.push(existing.docs[0])
      } else {
        const newCustomer = await payload.create({
          collection: 'users',
          data: {
            ...customer,
            password: 'Password@123',
            role: 'member',
          },
        })
        console.log(`  ✔ customer ${customer.email} created`)
        createdCustomers.push(newCustomer)
      }
    } catch (e: any) {
      console.error(`  ✗ Failed to create customer ${customer.email}: ${e.message}`)
    }
  }

  // Combine all customers
  const allCustomers = [...users, ...createdCustomers].filter((c) => c.role === 'member' || c.role === 'customer')

  // ─── CREATE SAMPLE ORDERS WITH DIFFERENT PAYMENT METHODS ─
  console.log('\n[Orders] Creating sample orders...\n')

  // Sample Order Data
  const sampleOrders = [
    {
      description: 'Order 1: QRIS Payment - Paid',
      customer: allCustomers[0],
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      items: [
        { product: products[0], quantity: 1 },
        { product: products[1], quantity: 2 },
      ],
      shippingCost: 15,
      discount: 0,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 2: Bank Transfer - Pending Review',
      customer: allCustomers[1],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'payment_review',
      fulfillmentStatus: 'unfulfilled',
      items: [
        { product: products[2], quantity: 1 },
        { product: products[3], quantity: 1 },
      ],
      shippingCost: 12,
      discount: 0,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 3: QRIS Payment - Completed',
      customer: allCustomers[2],
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      fulfillmentStatus: 'completed',
      items: [
        { product: products[4], quantity: 1 },
        { product: products[5], quantity: 3 },
      ],
      shippingCost: 18,
      discount: 5,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 4: Bank Transfer - Payment Received',
      customer: allCustomers[3],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      fulfillmentStatus: 'shipped',
      items: [
        { product: products[6], quantity: 1 },
        { product: products[7], quantity: 1 },
      ],
      shippingCost: 20,
      discount: 10,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 5: QRIS Payment - Pending',
      customer: allCustomers[4],
      paymentMethod: 'qris',
      paymentStatus: 'pending',
      fulfillmentStatus: 'unfulfilled',
      items: [
        { product: products[8], quantity: 2 },
        { product: products[9], quantity: 1 },
      ],
      shippingCost: 14,
      discount: 0,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 6: Bank Transfer - Failed',
      customer: allCustomers[0],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'failed',
      fulfillmentStatus: 'unfulfilled',
      items: [
        { product: products[10], quantity: 1 },
      ],
      shippingCost: 16,
      discount: 0,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 7: QRIS Payment - Multiple Items',
      customer: allCustomers[1],
      paymentMethod: 'qris',
      paymentStatus: 'paid',
      fulfillmentStatus: 'processing',
      items: [
        { product: products[0], quantity: 2 },
        { product: products[2], quantity: 1 },
        { product: products[4], quantity: 1 },
      ],
      shippingCost: 22,
      discount: 15,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
    {
      description: 'Order 8: Bank Transfer - COD Style',
      customer: allCustomers[2],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'pending',
      fulfillmentStatus: 'shipped',
      items: [
        { product: products[5], quantity: 2 },
        { product: products[6], quantity: 1 },
      ],
      shippingCost: 18,
      discount: 8,
      createdDate: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()),
    },
  ]

  const createdOrders: any[] = []

  for (const orderData of sampleOrders) {
    try {
      // Calculate totals
      let subtotal = 0
      const orderItems: any[] = []

      for (const item of orderData.items) {
        const product = item.product
        const quantity = item.quantity
        const price = product.price || 0
        const total = price * quantity

        subtotal += total

        orderItems.push({
          productTitle: product.title,
          quantity,
          unitPrice: price,
          totalPrice: total,
          sku: product.sku || '',
          product: product.id,
        })
      }

      const total = subtotal - (orderData.discount || 0) + (orderData.shippingCost || 0)

      // Create order
      const order = await payload.create({
        collection: 'orders',
        data: {
          customer: orderData.customer.id,
          items: orderItems,
          subtotal: subtotal,
          discountAmount: orderData.discount || 0,
          shippingCost: orderData.shippingCost || 0,
          tax: 0,
          total: total,
          checkoutCurrency: 'SGD',
          exchangeRateAtCheckout: 1,
          paymentMethod: orderData.paymentMethod as 'qris' | 'bank_transfer' | 'xendit' | 'cod' | 'other',
          paymentStatus: orderData.paymentStatus as 'pending' | 'payment_review' | 'paid' | 'failed' | 'refunded',
          fulfillmentStatus: orderData.fulfillmentStatus as 'unfulfilled' | 'processing' | 'shipped' | 'completed' | 'complaint',
          shippingAddress: {
            fullName: orderData.customer.name || 'Customer',
            phone: orderData.customer.phone || '',
            street: orderData.customer.addresses?.[0]?.street || 'Address',
            city: orderData.customer.addresses?.[0]?.city || 'Singapore',
            province: orderData.customer.addresses?.[0]?.province || '',
            district: '',
            subdistrict: '',
            postalCode: orderData.customer.addresses?.[0]?.postalCode || '',
            country: 'Singapore',
          },
          paymentData:
            orderData.paymentMethod === 'qris'
              ? {
                  qrisCode: 'sample-qris-code-' + Math.random().toString(36).substring(7),
                  merchantId: 'FATHSTORE001',
                  transactionType: 'qris',
                }
              : orderData.paymentMethod === 'bank_transfer'
                ? {
                    bankName: banks[0]?.name || 'DBS Bank Singapore',
                    accountNumber: banks[0]?.accountNumber || '048-1234567-8',
                    accountHolder: banks[0]?.accountHolder || 'FathStore Pte Ltd',
                    transferStatus: 'awaiting_confirmation',
                  }
                : undefined,
        } as any,
      })

      console.log(`  ✔ ${orderData.description}`)
      createdOrders.push(order)
    } catch (e: any) {
      console.error(`  ✗ Failed to create order: ${e.message}`)
    }
  }

  // ─── SUMMARY ──────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60))
  console.log('✅ Seeding Complete!')
  console.log('═'.repeat(60))
  console.log(`\n📊 Summary:`)
  console.log(`  • Created ${createdCustomers.length} new customer(s)`)
  console.log(`  • Total customers: ${allCustomers.length}`)
  console.log(`  • Created ${createdOrders.length} sample order(s)`)
  console.log(`\n💳 Payment Methods Used:`)
  console.log(`  • QRIS (QR Code Indonesian Standard)`)
  console.log(`  • Bank Transfer (Manual)`)
  console.log(`\n🌍 Region: Singapore (SGD)`)
  console.log(`\nTest Credentials:`)
  console.log(`  Admin:  admin@fathstore.com / Admin@12345`)
  console.log(`  Member: member@fathstore.com / Member@12345`)
  console.log(`\n📍 Access:`)
  console.log(`  Admin: http://localhost:3000/admin`)
  console.log(`  Store: http://localhost:3000`)
  console.log('\n')
}

// ─────────────────────────────────────────────────────────────
// RUN SEED
// ─────────────────────────────────────────────────────────────
seed()
  .then(() => {
    console.log('✅ Seed script completed successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seed script failed:', error)
    process.exit(1)
  })
