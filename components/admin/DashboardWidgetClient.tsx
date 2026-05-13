'use client'

import React, { useState } from 'react'

type Stats = {
  users: number
  members: number
  products: number
  orders: number
  ordersReview: number
  ordersPaid: number
  ordersCompleted: number
  transactions: number
  transactionsPending: number
  transactionsApproved: number
  materials: number
  enrollments: number
  reviewsPending: number
}

type Order = {
  id: string
  createdAt?: string
  total?: number
  paymentStatus?: string
  fulfillmentStatus?: string
  shippingAddress?: { fullName?: string }
}

type Transaction = {
  id: string
  createdAt?: string
  amount?: number
  status?: string
  method?: string
}

type Props = {
  stats: Stats
  recentOrders: Order[]
  recentTx: Transaction[]
}

const statusColor: Record<string, string> = {
  pending: '#f59e0b',
  payment_review: '#3b82f6',
  paid: '#10b981',
  completed: '#6366f1',
  failed: '#ef4444',
  approved: '#10b981',
  refunded: '#8b5cf6',
  unfulfilled: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#06b6d4',
  complaint: '#ef4444',
}

function Badge({ status }: { status: string }) {
  const color = statusColor[status] ?? '#6b7280'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: '999px',
      background: color + '22',
      color,
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'capitalize',
      border: `1px solid ${color}44`,
    }}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
  href,
  alert,
}: {
  label: string
  value: number | string
  sub?: string
  icon: string
  accent: string
  href?: string
  alert?: boolean
}) {
  const card = (
    <div style={{
      background: 'var(--theme-elevation-50, #1a1a1a)',
      border: `1px solid ${alert ? '#ef444444' : 'var(--theme-elevation-100, #2a2a2a)'}`,
      borderRadius: '12px',
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
      position: 'relative',
      overflow: 'hidden',
      cursor: href ? 'pointer' : 'default',
      transition: 'transform 0.15s, box-shadow 0.15s',
      boxShadow: alert ? '0 0 0 2px #ef444422' : 'none',
    }}
    onMouseEnter={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.transform = 'translateY(-2px)'
      el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
    }}
    onMouseLeave={e => {
      const el = e.currentTarget as HTMLDivElement
      el.style.transform = 'translateY(0)'
      el.style.boxShadow = alert ? '0 0 0 2px #ef444422' : 'none'
    }}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '4px', height: '100%',
        background: accent,
        borderRadius: '4px 0 0 4px',
      }} />

      <div style={{
        width: 40, height: 40,
        borderRadius: '10px',
        background: accent + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: 'var(--theme-text-secondary, #888)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          {label}
          {alert && <span style={{ marginLeft: 6, color: '#ef4444', fontSize: 10 }}>● Perlu aksi</span>}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--theme-text, #fff)', lineHeight: 1.1 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '12px', color: 'var(--theme-text-secondary, #888)', marginTop: '4px' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{card}</a>
  }
  return card
}

export function DashboardWidgetClient({ stats, recentOrders, recentTx }: Props) {
  const [tab, setTab] = useState<'orders' | 'transactions'>('orders')

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Selamat Pagi' : hour < 17 ? 'Selamat Siang' : 'Selamat Malam'

  return (
    <div style={{
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      marginBottom: '32px',
    }}>
      {/* Header greeting */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1729 0%, #1a2744 50%, #0d2137 100%)',
        borderRadius: '16px',
        padding: '28px 32px',
        marginBottom: '24px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #2a3a5c',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: '300px', height: '200px',
          background: 'radial-gradient(circle, #3b82f620 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
            {greeting}, Admin! 👋
          </div>
          <div style={{ fontSize: '14px', color: '#94a3b8' }}>
            FathStore · {now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Alert row */}
        {(stats.transactionsPending > 0 || stats.ordersReview > 0 || stats.reviewsPending > 0) && (
          <div style={{
            marginTop: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            {stats.transactionsPending > 0 && (
              <a href="/admin/collections/transactions" style={{
                textDecoration: 'none',
                background: '#f59e0b22',
                border: '1px solid #f59e0b44',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                color: '#f59e0b',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                ⚡ {stats.transactionsPending} transaksi menunggu konfirmasi
              </a>
            )}
            {stats.ordersReview > 0 && (
              <a href="/admin/collections/orders" style={{
                textDecoration: 'none',
                background: '#3b82f622',
                border: '1px solid #3b82f644',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                color: '#3b82f6',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                🔍 {stats.ordersReview} order perlu direview
              </a>
            )}
            {stats.reviewsPending > 0 && (
              <a href="/admin/collections/reviews" style={{
                textDecoration: 'none',
                background: '#8b5cf622',
                border: '1px solid #8b5cf644',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '13px',
                color: '#8b5cf6',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                ⭐ {stats.reviewsPending} ulasan belum disetujui
              </a>
            )}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '14px',
        marginBottom: '24px',
      }}>
        <StatCard
          label="Total Pengguna" value={stats.users}
          sub={`${stats.members} member`}
          icon="👥" accent="#6366f1"
          href="/admin/collections/users"
        />
        <StatCard
          label="Produk" value={stats.products}
          icon="📦" accent="#10b981"
          href="/admin/collections/products"
        />
        <StatCard
          label="Materi" value={stats.materials}
          sub={`${stats.enrollments} enrollments`}
          icon="📚" accent="#f59e0b"
          href="/admin/collections/materials"
        />
        <StatCard
          label="Total Order" value={stats.orders}
          sub={`${stats.ordersPaid} terbayar · ${stats.ordersCompleted} selesai`}
          icon="🛒" accent="#3b82f6"
          href="/admin/collections/orders"
        />
        <StatCard
          label="Review Payment" value={stats.ordersReview}
          icon="🔍" accent="#f59e0b"
          href="/admin/collections/orders"
          alert={stats.ordersReview > 0}
        />
        <StatCard
          label="Transaksi Pending" value={stats.transactionsPending}
          sub={`${stats.transactionsApproved} disetujui`}
          icon="💳" accent="#ef4444"
          href="/admin/collections/transactions"
          alert={stats.transactionsPending > 0}
        />
      </div>

      {/* Recent Activity */}
      <div style={{
        background: 'var(--theme-elevation-50, #1a1a1a)',
        border: '1px solid var(--theme-elevation-100, #2a2a2a)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--theme-elevation-100, #2a2a2a)',
        }}>
          {(['orders', 'transactions'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: 'none',
                border: 'none',
                padding: '14px 24px',
                fontSize: '13px',
                fontWeight: tab === t ? 600 : 400,
                color: tab === t ? 'var(--theme-text, #fff)' : 'var(--theme-text-secondary, #888)',
                cursor: 'pointer',
                borderBottom: tab === t ? '2px solid #6366f1' : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {t === 'orders' ? '🛒 Order Terbaru' : '💳 Transaksi Pending'}
            </button>
          ))}
        </div>

        {/* Table */}
        {tab === 'orders' ? (
          <div>
            {recentOrders.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontSize: 14 }}>Belum ada order</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--theme-elevation-100, #222)' }}>
                    {['ID', 'Pembeli', 'Total', 'Payment', 'Fulfillment', 'Tanggal'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        color: 'var(--theme-text-secondary, #888)',
                        fontWeight: 500,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o, i) => (
                    <tr key={o.id} style={{
                      borderTop: '1px solid var(--theme-elevation-100, #2a2a2a)',
                      background: i % 2 === 0 ? 'transparent' : 'var(--theme-elevation-50, #1e1e1e)',
                    }}>
                      <td style={{ padding: '12px 16px', color: '#6366f1', fontFamily: 'monospace', fontSize: 12 }}>
                        <a href={`/admin/collections/orders/${o.id}`} style={{ color: '#6366f1', textDecoration: 'none' }}>
                          #{String(o.id).slice(-6).toUpperCase()}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--theme-text, #fff)' }}>
                        {o.shippingAddress?.fullName ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>
                        {o.total != null ? `Rp ${Number(o.total).toLocaleString('id-ID')}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge status={o.paymentStatus ?? 'pending'} />
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge status={o.fulfillmentStatus ?? 'unfulfilled'} />
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--theme-text-secondary, #888)', fontSize: 12 }}>
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('id-ID') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div>
            {recentTx.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontSize: 14 }}>
                Tidak ada transaksi pending 🎉
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--theme-elevation-100, #222)' }}>
                    {['ID', 'Jumlah', 'Metode', 'Status', 'Tanggal'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px',
                        textAlign: 'left',
                        color: 'var(--theme-text-secondary, #888)',
                        fontWeight: 500,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTx.map((t, i) => (
                    <tr key={t.id} style={{
                      borderTop: '1px solid var(--theme-elevation-100, #2a2a2a)',
                      background: i % 2 === 0 ? 'transparent' : 'var(--theme-elevation-50, #1e1e1e)',
                    }}>
                      <td style={{ padding: '12px 16px', color: '#f59e0b', fontFamily: 'monospace', fontSize: 12 }}>
                        <a href={`/admin/collections/transactions/${t.id}`} style={{ color: '#f59e0b', textDecoration: 'none' }}>
                          #{String(t.id).slice(-6).toUpperCase()}
                        </a>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>
                        {t.amount != null ? `Rp ${Number(t.amount).toLocaleString('id-ID')}` : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--theme-text, #fff)', textTransform: 'capitalize' }}>
                        {(t.method ?? '—').replace(/_/g, ' ')}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <Badge status={t.status ?? 'pending'} />
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--theme-text-secondary, #888)', fontSize: 12 }}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleDateString('id-ID') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--theme-elevation-100, #2a2a2a)' }}>
              <a href="/admin/collections/transactions" style={{ color: '#6366f1', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                Lihat semua transaksi →
              </a>
            </div>
          </div>
        )}
      </div>

      <div style={{ height: '8px' }} />
    </div>
  )
}
