import { Package, Star, ShoppingBag, ArrowRight } from 'lucide-react'

export default function MemberDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, John! Here's what's happening with your account.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Total Orders" 
            value="12" 
            icon={Package} 
            color="blue" 
            trend="+2 this month"
        />
        <StatCard 
            title="Completed Orders" 
            value="8" 
            icon={ShoppingBag} 
            color="emerald" 
            trend="1 pending"
        />
        <StatCard 
            title="Reviews Written" 
            value="5" 
            icon={Star} 
            color="amber" 
            trend="Latest: 5 stars"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Left Column */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Recent Orders</h2>
                    <a href="/orders" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:underline">View All</a>
                </div>
                <div className="divide-y divide-gray-100">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Order #ORD-738{i}</p>
                                    <p className="text-sm text-gray-500">2 items • $12{i}.00</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                    Completed
                                </span>
                                <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Quick Actions / Right Column */}
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                    <a href="/orders" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                        <span className="font-medium text-gray-700 group-hover:text-emerald-800">Track Order</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-emerald-600" />
                    </a>
                    <a href="/reviews/new" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group">
                        <span className="font-medium text-gray-700 group-hover:text-amber-800">Write a Review</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-amber-600" />
                    </a>
                    <a href="/profile" className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                        <span className="font-medium text-gray-700 group-hover:text-blue-800">Update Profile</span>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-600" />
                    </a>
                </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold text-lg mb-2">Member Special</h3>
                <p className="text-emerald-100 text-sm mb-4">Get 20% off your next purchase using code MEMBER20</p>
                <button className="w-full py-2 bg-white text-emerald-900 rounded-lg font-semibold text-sm hover:bg-emerald-50 transition-colors">
                    Shop Now
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, trend }: { title: string; value: string; icon: any; color: 'blue' | 'emerald' | 'amber'; trend: string }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        amber: 'bg-amber-50 text-amber-600',
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">{trend}</p>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                <Icon size={24} />
            </div>
        </div>
    )
}
