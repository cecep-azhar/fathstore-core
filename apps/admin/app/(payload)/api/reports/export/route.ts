import { NextResponse } from 'next/server'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Report configurations
const REPORT_CONFIGS: Record<string, { collection: string; columns: string[]; labels: Record<string, string> }> = {
  orders: {
    collection: 'orders',
    columns: [
      'orderNumber', 'customer.name', 'total', 'paymentStatus', 'fulfillmentStatus',
      'paymentMethod', 'items', 'shippingAddress', 'createdAt'
    ],
    labels: {
      orderNumber: 'Order Number',
      'customer.name': 'Customer',
      total: 'Total',
      paymentStatus: 'Payment Status',
      fulfillmentStatus: 'Fulfillment Status',
      paymentMethod: 'Payment Method',
      items: 'Items',
      shippingAddress: 'Shipping Address',
      createdAt: 'Date'
    }
  },
  products: {
    collection: 'products',
    columns: [
      'title', 'slug', 'price', 'stock', 'status', 'category.name',
      'vendor', 'sku', 'createdAt'
    ],
    labels: {
      title: 'Product Title',
      slug: 'URL Slug',
      price: 'Price',
      stock: 'Stock',
      status: 'Status',
      'category.name': 'Category',
      vendor: 'Vendor',
      sku: 'SKU',
      createdAt: 'Created'
    }
  },
  customers: {
    collection: 'users',
    columns: [
      'name', 'email', 'role', 'phone', 'addresses', 'createdAt'
    ],
    labels: {
      name: 'Name',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
      addresses: 'Addresses',
      createdAt: 'Joined'
    }
  },
  inventory: {
    collection: 'products',
    columns: [
      'title', 'sku', 'stock', 'price', 'category.name', 'variants'
    ],
    labels: {
      title: 'Product',
      sku: 'SKU',
      stock: 'Stock',
      price: 'Price',
      'category.name': 'Category',
      variants: 'Variants'
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'orders'
    const format = searchParams.get('format') || 'csv'
    const limit = parseInt(searchParams.get('limit') || '1000', 10)

    const config = REPORT_CONFIGS[type]
    if (!config) {
      return NextResponse.json(
        { error: 'Invalid report type' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Fetch data
    const result = await payload.find({
      collection: config.collection,
      limit,
      sort: '-createdAt',
      depth: 2,
    })

    // Transform data
    const rows = result.docs.map((doc: any) => {
      const row: Record<string, any> = {}
      config.columns.forEach(col => {
        const value = col.includes('.')
          ? col.split('.').reduce((obj, key) => obj?.[key], doc)
          : doc[col]

        // Format values
        if (col === 'createdAt' && value) {
          row[col] = new Date(value).toISOString()
        } else if (col === 'total' && typeof value === 'number') {
          row[col] = value.toFixed(2)
        } else if (col === 'items' && Array.isArray(value)) {
          row[col] = value.map((item: any) => `${item.productTitle} x${item.quantity}`).join('; ')
        } else if (col === 'addresses' && Array.isArray(value)) {
          row[col] = value.map((addr: any) => `${addr.label}: ${addr.street}, ${addr.city}`).join('; ')
        } else if (col === 'variants' && Array.isArray(value)) {
          row[col] = value.map((v: any) => `${v.variantTitle}: ${v.stock || 0}`).join('; ')
        } else {
          row[col] = value ?? ''
        }
      })
      return row
    })

    // Generate export based on format
    if (format === 'json') {
      return NextResponse.json({
        data: rows,
        columns: config.columns.map(col => ({
          field: col,
          label: config.labels[col] || col
        })),
        total: result.totalDocs,
        exportedAt: new Date().toISOString()
      })
    }

    if (format === 'csv') {
      const headers = config.columns.map(col => config.labels[col] || col)
      const csvRows = rows.map(row =>
        config.columns.map(col => {
          const value = String(row[col] || '').replace(/"/g, '""')
          return `"${value}"`
        }).join(',')
      )

      const csv = [headers.join(','), ...csvRows].join('\n')

      return new Response(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${type}-report-${Date.now()}.csv"`
        }
      })
    }

    // For other formats, return error
    return NextResponse.json(
      { error: `Format '${format}' not supported in this endpoint` },
      { status: 400 }
    )

  } catch (error) {
    console.error('Report export error:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}