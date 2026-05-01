import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import { getAuthUser } from '@/lib/auth-helpers'

// Brand seed configurations
const BRAND_CONFIGS: Record<string, {
  name: string
  slug: string
  description: string
  businessMode: 'ecommerce' | 'fnb'
  categories: string[]
  products: { name: string; price: number; category: string }[]
  banks: { name: string; accountNumber: string; holderName: string }[]
  shippingProviders: { name: string; slug: string; price: number }[]
  discounts: { code: string; discount: number; type: 'percentage' | 'fixed'; minOrder: number }[]
}> = {
  exortive: {
    name: 'Exortive',
    slug: 'exortive',
    description: 'Premium local bag brand - tas berkualitas tinggi untuk gaya hidup modern',
    businessMode: 'ecommerce',
    categories: [
      'Backpack', 'Sling Bag', 'Tote Bag', 'Waist Bag', 'Laptop Bag',
      'Travel Bag', 'Wallet & Card Holder', 'Accessories',
    ],
    products: [
      { name: 'Exortive Urban Backpack Pro', price: 385000, category: 'Backpack' },
      { name: 'Exortive Minimalist Sling Bag', price: 165000, category: 'Sling Bag' },
      { name: 'Exortive Executive Tote Bag', price: 295000, category: 'Tote Bag' },
      { name: 'Exortive Sport Waist Bag', price: 89000, category: 'Waist Bag' },
      { name: 'Exortive Laptop Sleeve 15 inch', price: 145000, category: 'Laptop Bag' },
      { name: 'Exortive Weekend Travel Duffle', price: 425000, category: 'Travel Bag' },
      { name: 'Exortive Premium Wallet Brown', price: 125000, category: 'Wallet & Card Holder' },
      { name: 'Exortive Card Holder Minimal', price: 65000, category: 'Wallet & Card Holder' },
      { name: 'Exortive Organizer Pouch', price: 75000, category: 'Accessories' },
      { name: 'Exortive Keychain Leather', price: 45000, category: 'Accessories' },
      { name: 'Exortive Travel Pillow', price: 95000, category: 'Accessories' },
      { name: 'Exortive Waterproof Rain Cover', price: 55000, category: 'Accessories' },
      { name: 'Exortive Laptop Backpack 15.6"', price: 445000, category: 'Backpack' },
      { name: 'Exortive Anti-Theft Backpack', price: 395000, category: 'Backpack' },
      { name: 'Exortive Canvas Tote Large', price: 185000, category: 'Tote Bag' },
      { name: 'Exortive Crossbody Bag Navy', price: 225000, category: 'Sling Bag' },
      { name: 'Exortive Business Laptop Bag', price: 365000, category: 'Laptop Bag' },
      { name: 'Exortive Expandable Duffel Bag', price: 485000, category: 'Travel Bag' },
      { name: 'Exortive RFID Blocking Wallet', price: 135000, category: 'Wallet & Card Holder' },
      { name: 'Exortive Passport Holder', price: 85000, category: 'Accessories' },
    ],
    banks: [
      { name: 'BCA', accountNumber: '1234567890', holderName: 'PT Exortive Indonesia' },
      { name: 'Mandiri', accountNumber: '1300087654321', holderName: 'PT Exortive Indonesia' },
      { name: 'BNI', accountNumber: '0123456789', holderName: 'PT Exortive Indonesia' },
      { name: 'OVO', accountNumber: '081234567890', holderName: 'Exortive Store' },
    ],
    shippingProviders: [
      { name: 'JNE', slug: 'jne', price: 18000 },
      { name: 'J&T Express', slug: 'jt', price: 15000 },
      { name: 'SiCepat', slug: 'sicepat', price: 17000 },
      { name: 'AnterAja', slug: 'anteraja', price: 14000 },
    ],
    discounts: [
      { code: 'EXORTIVE10', discount: 10, type: 'percentage', minOrder: 200000 },
      { code: 'FIRSTBUY', discount: 15000, type: 'fixed', minOrder: 100000 },
      { code: 'FREESHIP', discount: 0, type: 'percentage', minOrder: 300000 },
    ],
  },
  zunika: {
    name: 'Zunika',
    slug: 'zunika',
    description: 'Stylish local socks brand - kaos kaki trendi untuk aktivitas sehari-hari',
    businessMode: 'ecommerce',
    categories: [
      'Ankle Socks', 'Crew Socks', 'Long Socks', 'Sports Socks', 'Dress Socks',
      ' diabetic Socks', 'Compression Socks', 'Gift Sets',
    ],
    products: [
      { name: 'Zunika Classic Ankle 3 Pairs - Black', price: 45000, category: 'Ankle Socks' },
      { name: 'Zunika Comfort Ankle 5 Pairs Pack', price: 69000, category: 'Ankle Socks' },
      { name: 'Zunika Sport Ankle Performance', price: 55000, category: 'Sports Socks' },
      { name: 'Zunika Bamboo Ankle Antibacterial', price: 48000, category: 'Ankle Socks' },
      { name: 'Zunika Logo Crew Socks 3 Pairs', price: 55000, category: 'Crew Socks' },
      { name: 'Zunika Pattern Crew Socks 5 Pairs', price: 79000, category: 'Crew Socks' },
      { name: 'Zunika Office Crew Socks 3 Pairs', price: 65000, category: 'Dress Socks' },
      { name: 'Zunika Bamboo Crew Socks Premium', price: 72000, category: 'Crew Socks' },
      { name: 'Zunika Running Long Socks Pair', price: 58000, category: 'Long Socks' },
      { name: 'Zunika Hiking Long Socks Thermal', price: 72000, category: 'Long Socks' },
      { name: 'Zunika Diabetic Comfort Socks', price: 65000, category: 'Diabetic Socks' },
      { name: 'Zunika Medical Compression Socks', price: 85000, category: 'Compression Socks' },
      { name: 'Zunika Gift Box Premium 10 Pairs', price: 149000, category: 'Gift Sets' },
      { name: 'Zunika Gift Set Couple 4 Pairs', price: 89000, category: 'Gift Sets' },
      { name: 'Zunika Kids Ankle Socks 5 Pairs', price: 55000, category: 'Ankle Socks' },
      { name: 'Zunika Sport Running Socks Quarter', price: 48000, category: 'Sports Socks' },
      { name: 'Zunika No-Show Liner Socks 3 Pairs', price: 42000, category: 'Ankle Socks' },
      { name: 'Zunika Compression Leggings Socks', price: 78000, category: 'Compression Socks' },
      { name: 'Zunika Formal Dress Socks 2 Pairs', price: 55000, category: 'Dress Socks' },
      { name: 'Zunika Seasonal Pattern Socks 3P', price: 62000, category: 'Crew Socks' },
    ],
    banks: [
      { name: 'BCA', accountNumber: '2345678901', holderName: 'CV Zunika Socks' },
      { name: 'BRI', accountNumber: '0012013004567', holderName: 'CV Zunika Socks' },
      { name: 'Dana', accountNumber: '081234567891', holderName: 'Zunika Store' },
    ],
    shippingProviders: [
      { name: 'JNE', slug: 'jne', price: 12000 },
      { name: 'J&T Express', slug: 'jt', price: 10000 },
      { name: 'SiCepat', slug: 'sicepat', price: 11000 },
      { name: 'GrabExpress', slug: 'grab', price: 15000 },
    ],
    discounts: [
      { code: 'ZUNIKA5', discount: 5, type: 'percentage', minOrder: 100000 },
      { code: 'SOCKS15', discount: 15000, type: 'fixed', minOrder: 150000 },
      { code: 'BUNDLE20', discount: 20, type: 'percentage', minOrder: 250000 },
    ],
  },
  ngombe: {
    name: 'Ngombe',
    slug: 'ngombe',
    description: 'Premium Indonesian coffee & food brand - kopi dan makanan berkualitas',
    businessMode: 'fnb',
    categories: [
      'Coffee', 'Non-Coffee Beverages', 'Food', 'Snacks', 'Merchandise', 'Packages',
    ],
    products: [
      { name: 'Ngombe Signature Latte', price: 32000, category: 'Coffee' },
      { name: 'Ngombe Americano', price: 28000, category: 'Coffee' },
      { name: 'Ngombe V60 Single Origin', price: 38000, category: 'Coffee' },
      { name: 'Ngombe Es Kopi Susu Aren', price: 25000, category: 'Coffee' },
      { name: 'Ngombe Cold Brew', price: 35000, category: 'Coffee' },
      { name: 'Ngombe Matcha Latte', price: 30000, category: 'Non-Coffee Beverages' },
      { name: 'Ngombe Thai Tea', price: 22000, category: 'Non-Coffee Beverages' },
      { name: 'Ngombe Fresh Orange Juice', price: 18000, category: 'Non-Coffee Beverages' },
      { name: 'Ngombe Lemon Tea', price: 15000, category: 'Non-Coffee Beverages' },
      { name: 'Ngombe Yakult Fruit Soda', price: 20000, category: 'Non-Coffee Beverages' },
      { name: 'Ngombe Nasi Goreng Spesial', price: 38000, category: 'Food' },
      { name: 'Ngombe Mie Goreng Jawa', price: 35000, category: 'Food' },
      { name: 'Ngombe Rice Bowl Teriyaki', price: 42000, category: 'Food' },
      { name: 'Ngombe Chicken Katsu Curry', price: 45000, category: 'Food' },
      { name: 'Ngombe Indomie Goreng Special', price: 25000, category: 'Food' },
      { name: 'Ngombe Croffle Chocolate', price: 28000, category: 'Snacks' },
      { name: 'Ngombe Croffle Cheese', price: 28000, category: 'Snacks' },
      { name: 'Ngombe French Fries', price: 22000, category: 'Snacks' },
      { name: 'Ngombe Chicken Wings 5pcs', price: 35000, category: 'Snacks' },
      { name: 'Ngombe Coffee Beans 250gr', price: 85000, category: 'Merchandise' },
      { name: 'Ngombe Tumbler', price: 75000, category: 'Merchandise' },
      { name: 'Ngombe T-Shirt', price: 120000, category: 'Merchandise' },
      { name: 'Ngombe Coffee Package 3in1', price: 55000, category: 'Packages' },
      { name: 'Ngombe Premium Gift Box', price: 250000, category: 'Packages' },
      { name: 'Ngombe Monthly Coffee Subscription', price: 350000, category: 'Packages' },
    ],
    banks: [
      { name: 'BCA', accountNumber: '3456789012', holderName: 'PT Ngombe Food Indonesia' },
      { name: 'Mandiri', accountNumber: '1300098765432', holderName: 'PT Ngombe Food Indonesia' },
      { name: 'GoPay', accountNumber: '081234567892', holderName: 'Ngombe Store' },
      { name: 'OVO', accountNumber: '081234567893', holderName: 'Ngombe Store' },
    ],
    shippingProviders: [
      { name: 'GrabExpress', slug: 'grab', price: 12000 },
      { name: 'GoSend', slug: 'gosend', price: 15000 },
      { name: 'SiCepat', slug: 'sicepat', price: 18000 },
    ],
    discounts: [
      { code: 'NGOMBE20', discount: 20, type: 'percentage', minOrder: 50000 },
      { code: 'COFFEE10', discount: 10, type: 'percentage', minOrder: 100000 },
      { code: 'FREEDELIVERY', discount: 0, type: 'percentage', minOrder: 150000 },
    ],
  },
}

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) => {
  try {
    const { brand } = await params
    const config = BRAND_CONFIGS[brand.toLowerCase()]

    if (!config) {
      return NextResponse.json({
        error: 'Brand not found',
        available: Object.keys(BRAND_CONFIGS),
      }, { status: 404 })
    }

    const user = getAuthUser(req)
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const payload = await getPayload({ config: payloadConfig })

    // Check if tenant already exists
    const existingTenant = await payload.findFirst({
      collection: 'tenants',
      where: { slug: { equals: config.slug } },
    })

    let tenant: any = existingTenant

    // Create or update tenant
    if (tenant) {
      tenant = await payload.update({
        collection: 'tenants',
        id: tenant.id,
        data: {
          name: config.name,
          businessMode: config.businessMode,
          isActive: true,
        },
      })
    } else {
      tenant = await payload.create({
        collection: 'tenants',
        data: {
          name: config.name,
          slug: config.slug,
          description: config.description,
          businessMode: config.businessMode,
          isActive: true,
          contactEmail: `info@${config.slug}.com`,
          contactPhone: '021-1234567',
        },
      })
    }

    const result: any = {
      tenant: { id: tenant.id, name: tenant.name, slug: tenant.slug },
      categories: 0,
      products: 0,
      banks: 0,
      discounts: 0,
      shippingProviders: 0,
    }

    // Create categories
    const categoryMap: Record<string, any> = {}
    for (const catName of config.categories) {
      const existing = await payload.findFirst({
        collection: 'categories',
        where: {
          title: { equals: catName },
          tenant: { equals: tenant.id },
        },
      })

      if (existing) {
        categoryMap[catName] = existing
      } else {
        const cat = await payload.create({
          collection: 'categories',
          data: {
            title: catName,
            slug: catName.toLowerCase().replace(/\s+/g, '-'),
            tenant: tenant.id,
            status: 'active',
          },
        })
        categoryMap[catName] = cat
        result.categories++
      }
    }

    // Create products
    for (const prod of config.products) {
      const existing = await payload.findFirst({
        collection: 'products',
        where: {
          title: { equals: prod.name },
        },
      })

      if (!existing) {
        const cat = categoryMap[prod.category]
        await payload.create({
          collection: 'products',
          data: {
            title: prod.name,
            slug: prod.name.toLowerCase().replace(/\s+/g, '-').substring(0, 50),
            price: prod.price,
            category: cat?.id,
            vendor: tenant.id,
            status: 'active',
            stock: Math.floor(Math.random() * 100) + 10,
            trackInventory: true,
          },
        })
        result.products++
      }
    }

    // Create banks
    for (const bank of config.banks) {
      const existing = await payload.findFirst({
        collection: 'banks',
        where: {
          bankName: { equals: bank.name },
          accountNumber: { equals: bank.accountNumber },
        },
      })

      if (!existing) {
        await payload.create({
          collection: 'banks',
          data: {
            bankName: bank.name,
            accountNumber: bank.accountNumber,
            holderName: bank.holderName,
            isActive: true,
          },
        })
        result.banks++
      }
    }

    // Create discounts
    for (const disc of config.discounts) {
      const existing = await payload.findFirst({
        collection: 'discounts',
        where: {
          code: { equals: disc.code },
        },
      })

      if (!existing) {
        await payload.create({
          collection: 'discounts',
          data: {
            code: disc.code,
            type: disc.type,
            value: disc.discount,
            minOrderAmount: disc.minOrder,
            limit: 100,
            used: 0,
            isActive: true,
          },
        })
        result.discounts++
      }
    }

    // Create shipping providers
    for (const sp of config.shippingProviders) {
      const existing = await payload.findFirst({
        collection: 'shipping-providers',
        where: {
          slug: { equals: sp.slug },
        },
      })

      if (!existing) {
        await payload.create({
          collection: 'shipping-providers',
          data: {
            name: sp.name,
            slug: sp.slug,
            isActive: true,
            defaultPrice: sp.price,
            estimatedDays: '2-4',
          },
        })
        result.shippingProviders++
      }
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Successfully seeded ${config.name} data`,
    })
  } catch (error: any) {
    console.error('[POST /api/v1/seed/[brand]]', error)
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 })
  }
}