// @ts-nocheck

import path from 'path'
import dotenv from 'dotenv'
import { apiRequest, loginAdmin, upsertByField } from './rest-client'

dotenv.config({ path: path.resolve(process.cwd(), '..', '..', '.env.local') })

const ADMIN_EMAIL = 'admin@fathstore.com'
const ADMIN_PASSWORD = 'Admin@12345'
const MEMBER_EMAIL = 'member@fathstore.com'
const MEMBER_PASSWORD = 'Member@12345'

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `FS-${timestamp}-${random}`
}

const sampleCustomers = [
  {
    email: 'customer1@example.com',
    name: 'Ahmad Riyanto',
    phone: '+65 9123 4567',
    addresses: [{ label: 'home', fullName: 'Ahmad Riyanto', street: '123 Clementi Road #15-01, Singapore 129742', city: 'Singapore', province: 'Singapore', postalCode: '129742' }],
  },
  {
    email: 'customer2@example.com',
    name: 'Sarah Wong',
    phone: '+65 8765 4321',
    addresses: [{ label: 'home', fullName: 'Sarah Wong', street: '456 Kallang Road #08-02, Singapore 108282', city: 'Singapore', province: 'Singapore', postalCode: '108282' }],
  },
  {
    email: 'customer3@example.com',
    name: 'Rajesh Kumar',
    phone: '+65 8234 5678',
    addresses: [{ label: 'home', fullName: 'Rajesh Kumar', street: '789 Bedok Road #12-03, Singapore 429234', city: 'Singapore', province: 'Singapore', postalCode: '429234' }],
  },
  {
    email: 'customer4@example.com',
    name: 'Lisa Chen',
    phone: '+65 9876 5432',
    addresses: [{ label: 'home', fullName: 'Lisa Chen', street: '321 Marina Bay #20-05, Singapore 018956', city: 'Singapore', province: 'Singapore', postalCode: '018956' }],
  },
  {
    email: 'customer5@example.com',
    name: 'Mohammad Husein',
    phone: '+65 8901 2345',
    addresses: [{ label: 'home', fullName: 'Mohammad Husein', street: '654 Bukit Merah #06-07, Singapore 150654', city: 'Singapore', province: 'Singapore', postalCode: '150654' }],
  },
]

function pickItemPrice(product: any) {
  return typeof product.price === 'number' ? product.price : 0
}

async function seed() {
  console.log('\nFathStore sample transaction seeding via REST API\n')

  const token = await loginAdmin(ADMIN_EMAIL, ADMIN_PASSWORD)

  const productsResponse = await apiRequest<{ docs: any[] }>('/api/products', {
    query: { limit: 50, sort: 'title' },
  })
  const products = productsResponse.docs
  if (products.length < 4) {
    throw new Error('Not enough products found. Run master seeding first.')
  }

  const banksResponse = await apiRequest<{ docs: any[] }>('/api/banks', {
    query: { limit: 20 },
  })
  const banks = banksResponse.docs

  const member = await upsertByField('users', 'email', MEMBER_EMAIL, {
    name: 'Jane Member',
    email: MEMBER_EMAIL,
    password: MEMBER_PASSWORD,
    role: 'member',
    phone: '+65 8200 0001',
    addresses: [{ label: 'home', fullName: 'Jane Member', street: '10 Orchard Road #05-01, Singapore 238847', city: 'Singapore', province: 'Singapore', postalCode: '238847' }],
  }, token)

  const createdCustomers: any[] = [member]
  for (const customer of sampleCustomers) {
    const doc = await upsertByField('users', 'email', customer.email, {
      ...customer,
      password: 'Password@123',
      role: 'member',
    }, token)
    createdCustomers.push(doc)
  }

  const orders = [
    { paymentMethod: 'qris', paymentStatus: 'paid', fulfillmentStatus: 'processing', discountAmount: 0, shippingCost: 15, itemIndexes: [0, 1], customerIndex: 0, paymentData: { qrisCode: 'sample-qris-001', merchantId: 'FATHSTORE001', transactionType: 'qris' } },
    { paymentMethod: 'bank_transfer', paymentStatus: 'payment_review', fulfillmentStatus: 'unfulfilled', discountAmount: 0, shippingCost: 12, itemIndexes: [2, 3], customerIndex: 1, paymentData: { bankName: banks[0]?.name || 'DBS Bank Singapore', accountNumber: banks[0]?.accountNumber || '048-1234567-8', accountHolder: banks[0]?.accountHolder || 'FathStore Pte Ltd', transferStatus: 'awaiting_confirmation' } },
    { paymentMethod: 'qris', paymentStatus: 'paid', fulfillmentStatus: 'completed', discountAmount: 5, shippingCost: 18, itemIndexes: [4, 5], customerIndex: 2, paymentData: { qrisCode: 'sample-qris-003', merchantId: 'FATHSTORE001', transactionType: 'qris' } },
    { paymentMethod: 'bank_transfer', paymentStatus: 'paid', fulfillmentStatus: 'shipped', discountAmount: 10, shippingCost: 20, itemIndexes: [6, 7], customerIndex: 3, paymentData: { bankName: banks[0]?.name || 'DBS Bank Singapore', accountNumber: banks[0]?.accountNumber || '048-1234567-8', accountHolder: banks[0]?.accountHolder || 'FathStore Pte Ltd', transferStatus: 'confirmed' } },
    { paymentMethod: 'qris', paymentStatus: 'pending', fulfillmentStatus: 'unfulfilled', discountAmount: 0, shippingCost: 14, itemIndexes: [1, 4], customerIndex: 4, paymentData: { qrisCode: 'sample-qris-005', merchantId: 'FATHSTORE001', transactionType: 'qris' } },
    { paymentMethod: 'bank_transfer', paymentStatus: 'failed', fulfillmentStatus: 'unfulfilled', discountAmount: 0, shippingCost: 16, itemIndexes: [5], customerIndex: 0, paymentData: { bankName: banks[1]?.name || 'OCBC Bank Singapore', accountNumber: banks[1]?.accountNumber || '7373-123456-001', accountHolder: banks[1]?.accountHolder || 'FathStore Pte Ltd', transferStatus: 'failed' } },
    { paymentMethod: 'qris', paymentStatus: 'paid', fulfillmentStatus: 'processing', discountAmount: 15, shippingCost: 22, itemIndexes: [0, 2, 4], customerIndex: 1, paymentData: { qrisCode: 'sample-qris-007', merchantId: 'FATHSTORE001', transactionType: 'qris' } },
    { paymentMethod: 'bank_transfer', paymentStatus: 'pending', fulfillmentStatus: 'shipped', discountAmount: 8, shippingCost: 18, itemIndexes: [3, 6], customerIndex: 2, paymentData: { bankName: banks[0]?.name || 'DBS Bank Singapore', accountNumber: banks[0]?.accountNumber || '048-1234567-8', accountHolder: banks[0]?.accountHolder || 'FathStore Pte Ltd', transferStatus: 'awaiting_confirmation' } },
  ]

  let createdCount = 0

  for (const [index, orderSeed] of orders.entries()) {
    const customer = createdCustomers[orderSeed.customerIndex]
    const selectedProducts = orderSeed.itemIndexes.map((productIndex) => products[productIndex])

    const items = selectedProducts.map((product: any, itemIndex: number) => {
      const quantity = itemIndex === 0 ? 1 : itemIndex === 1 ? 2 : 1
      const unitPrice = pickItemPrice(product)
      return {
        product: product.id,
        productTitle: product.title,
        quantity,
        unitPrice,
        totalPrice: unitPrice * quantity,
        sku: product.sku || '',
      }
    })

    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
    const total = subtotal - orderSeed.discountAmount + orderSeed.shippingCost

    await apiRequest('/api/orders', {
      method: 'POST',
      token,
      body: {
        orderNumber: generateOrderNumber(),
        customer: customer.id,
        items,
        subtotal,
        discountAmount: orderSeed.discountAmount,
        shippingCost: orderSeed.shippingCost,
        tax: 0,
        total,
        checkoutCurrency: 'SGD',
        exchangeRateAtCheckout: 1,
        paymentMethod: orderSeed.paymentMethod,
        paymentStatus: orderSeed.paymentStatus,
        fulfillmentStatus: orderSeed.fulfillmentStatus,
        paymentData: orderSeed.paymentData,
        shippingAddress: {
          fullName: customer.name,
          phone: customer.phone,
          street: customer.addresses?.[0]?.street || 'Singapore',
          city: 'Singapore',
          province: '',
          postalCode: customer.addresses?.[0]?.postalCode || '',
          country: 'Singapore',
        },
      },
    })

    createdCount += 1
    console.log(`  ✔ order ${index + 1} created`)
  }

  console.log('\nSample transactions complete')
  console.log(`Created ${createdCount} orders with QRIS and bank transfer payment methods.`)
}

seed().catch((error) => {
  console.error('Seed sample transactions failed:', error)
  process.exit(1)
})
