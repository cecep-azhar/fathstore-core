'use client'

import React, { useEffect, useState } from 'react'
import './DashboardStats.scss'

interface KPIData {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  totalProducts: number
  lowStockCount: number
  pendingOrders: number
  recentOrders: Array<{
    orderNumber: string
    total: number
    paymentStatus: string
    fulfillmentStatus: string
    customer: { name?: string }
    createdAt: string
  }>
  salesByDay: Array<{ date: string; total: number }>
}

const formatCurrency = (amount: number, currency = 'SGD'): string => {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'badge--paid'
    case 'pending':
      return 'badge--pending'
    case 'failed':
      return 'badge--failed'
    case 'refunded':
      return 'badge--refunded'
    case 'completed':
      return 'badge--completed'
    case 'processing':
      return 'badge--processing'
    case 'shipped':
      return 'badge--shipped'
    default:
      return ''
  }
}

const DashboardStats: React.FC = () => {
  const [data, setData] = useState<KPIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Calculate 30 days ago
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        const isoDate = thirtyDaysAgo.toISOString()

        // Fetch paid orders from last 30 days
        const ordersRes = await fetch(
          `/api/orders?where[paymentStatus][equals]=paid&where[createdAt][greater_than]=${isoDate}&limit=500&sort=-createdAt`
        )
        const ordersData = ordersRes.ok ? await ordersRes.json() : { docs: [] }
        const orders = ordersData.docs || []

        // Fetch all orders for pending count
        const allOrdersRes = await fetch('/api/orders?limit=1')
        const allOrdersData = allOrdersRes.ok ? await allOrdersRes.json() : { totalDocs: 0 }

        // Fetch users
        const usersRes = await fetch('/api/users?limit=1')
        const usersData = usersRes.ok ? await usersRes.json() : { totalDocs: 0 }

        // Fetch products
        const productsRes = await fetch('/api/products?limit=1')
        const productsData = productsRes.ok ? await productsRes.json() : { totalDocs: 0 }

        // Fetch low stock products
        const lowStockRes = await fetch('/api/products?where[stock][less_than]=10&where[trackInventory][equals]=true&limit=1')
        const lowStockData = lowStockRes.ok ? await lowStockRes.json() : { totalDocs: 0 }

        // Fetch pending orders
        const pendingRes = await fetch('/api/orders?where[paymentStatus][equals]=pending&limit=1')
        const pendingData = pendingRes.ok ? await pendingRes.json() : { totalDocs: 0 }

        // Calculate KPIs
        const totalSales = orders.reduce(
          (sum: number, order: { total?: number }) => sum + (order.total || 0),
          0
        )
        const totalOrders = orders.length
        const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0

        // Get 5 most recent for the table
        const recentOrders = orders.slice(0, 5).map(
          (order: {
            orderNumber?: string
            total?: number
            paymentStatus?: string
            fulfillmentStatus?: string
            customer?: { name?: string }
            createdAt?: string
          }) => ({
            orderNumber: order.orderNumber || '-',
            total: order.total || 0,
            paymentStatus: order.paymentStatus || 'pending',
            fulfillmentStatus: order.fulfillmentStatus || 'unfulfilled',
            customer: order.customer || {},
            createdAt: order.createdAt || '',
          })
        )

        // Calculate sales by day
        const salesByDay: Array<{ date: string; total: number }> = []
        const dayMap = new Map<string, number>()

        orders.forEach((order: { total?: number; createdAt?: string }) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt).toISOString().split('T')[0]
            dayMap.set(date, (dayMap.get(date) || 0) + (order.total || 0))
          }
        })

        dayMap.forEach((total, date) => {
          salesByDay.push({ date, total })
        })

        salesByDay.sort((a, b) => a.date.localeCompare(b.date))

        setData({
          totalSales,
          totalOrders,
          averageOrderValue,
          totalCustomers: usersData.totalDocs || 0,
          totalProducts: productsData.totalDocs || 0,
          lowStockCount: lowStockData.totalDocs || 0,
          pendingOrders: pendingData.totalDocs || 0,
          recentOrders,
          salesByDay: salesByDay.slice(-7), // Last 7 days
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="dashboard-stats">
        <div className="dashboard-stats__loading">
          <div className="dashboard-stats__spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-stats">
        <div className="dashboard-stats__error">
          <p>⚠️ {error}</p>
        </div>
      </div>
    )
  }

  if (!data) return null

  // Calculate max for chart scaling
  const maxSale = Math.max(...data.salesByDay.map(d => d.total), 1)

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stats__header">
        <h2>📊 Store Performance</h2>
        <span className="dashboard-stats__period">Last 30 days</span>
      </div>

      <div className="dashboard-stats__grid">
        {/* Total Sales */}
        <div className="dashboard-stats__card dashboard-stats__card--sales">
          <div className="dashboard-stats__card-icon">💰</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Total Revenue</span>
            <span className="dashboard-stats__card-value">
              {formatCurrency(data.totalSales)}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="dashboard-stats__card dashboard-stats__card--orders">
          <div className="dashboard-stats__card-icon">📦</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Total Orders</span>
            <span className="dashboard-stats__card-value">
              {formatNumber(data.totalOrders)}
            </span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="dashboard-stats__card dashboard-stats__card--avg">
          <div className="dashboard-stats__card-icon">📈</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Avg Order Value</span>
            <span className="dashboard-stats__card-value">
              {formatCurrency(data.averageOrderValue)}
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="dashboard-stats__card dashboard-stats__card--customers">
          <div className="dashboard-stats__card-icon">👥</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Customers</span>
            <span className="dashboard-stats__card-value">
              {formatNumber(data.totalCustomers)}
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="dashboard-stats__card dashboard-stats__card--products">
          <div className="dashboard-stats__card-icon">🏷️</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Products</span>
            <span className="dashboard-stats__card-value">
              {formatNumber(data.totalProducts)}
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="dashboard-stats__card dashboard-stats__card--pending">
          <div className="dashboard-stats__card-icon">⏳</div>
          <div className="dashboard-stats__card-content">
            <span className="dashboard-stats__card-label">Pending Orders</span>
            <span className="dashboard-stats__card-value">
              {formatNumber(data.pendingOrders)}
            </span>
          </div>
        </div>

        {/* Low Stock Alert */}
        {data.lowStockCount > 0 && (
          <div className="dashboard-stats__card dashboard-stats__card--warning">
            <div className="dashboard-stats__card-icon">⚠️</div>
            <div className="dashboard-stats__card-content">
              <span className="dashboard-stats__card-label">Low Stock Alert</span>
              <span className="dashboard-stats__card-value">
                {data.lowStockCount} items
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sales Chart */}
      {data.salesByDay.length > 0 && (
        <div className="dashboard-stats__chart">
          <h3>Sales (Last 7 Days)</h3>
          <div className="dashboard-stats__chart-container">
            {data.salesByDay.map((day) => (
              <div key={day.date} className="dashboard-stats__chart-bar">
                <div
                  className="dashboard-stats__chart-bar-fill"
                  style={{ height: `${(day.total / maxSale) * 100}%` }}
                >
                  <span className="dashboard-stats__chart-value">
                    {formatCurrency(day.total)}
                  </span>
                </div>
                <span className="dashboard-stats__chart-label">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      {data.recentOrders.length > 0 && (
        <div className="dashboard-stats__table-wrapper">
          <h3>Recent Orders</h3>
          <table className="dashboard-stats__table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Fulfillment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.orderNumber}>
                  <td>
                    <a href={`/admin/collections/orders?where[orderNumber][equals]=${order.orderNumber}`}>
                      {order.orderNumber}
                    </a>
                  </td>
                  <td>{order.customer?.name || 'Guest'}</td>
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`dashboard-stats__badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`dashboard-stats__badge ${getStatusBadgeClass(order.fulfillmentStatus)}`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DashboardStats