'use client'

import React, { useEffect, useState } from 'react'
import './DashboardStats.scss'

interface KPIData {
  totalSales: number
  totalOrders: number
  averageOrderValue: number
  recentOrders: Array<{
    orderNumber: string
    total: number
    paymentStatus: string
    createdAt: string
  }>
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
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
        const response = await fetch(
          `/api/orders?where[paymentStatus][equals]=paid&where[createdAt][greater_than]=${isoDate}&limit=500&sort=-createdAt`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }

        const result = await response.json()
        const orders = result.docs || []

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
            createdAt?: string
          }) => ({
            orderNumber: order.orderNumber || '-',
            total: order.total || 0,
            paymentStatus: order.paymentStatus || 'pending',
            createdAt: order.createdAt || '',
          })
        )

        setData({
          totalSales,
          totalOrders,
          averageOrderValue,
          recentOrders,
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
            <span className="dashboard-stats__card-label">Total Sales</span>
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
              {data.totalOrders.toLocaleString('id-ID')}
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
      </div>

      {/* Recent Orders Table */}
      {data.recentOrders.length > 0 && (
        <div className="dashboard-stats__table-wrapper">
          <h3>Recent Orders</h3>
          <table className="dashboard-stats__table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Total</th>
                <th>Status</th>
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
                  <td>{formatCurrency(order.total)}</td>
                  <td>
                    <span className={`dashboard-stats__badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus}
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
