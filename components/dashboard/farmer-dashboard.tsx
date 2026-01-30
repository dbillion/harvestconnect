'use client';

import apiClient, { Order, Product } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
  AlertTriangle,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  FileText,
  LayoutDashboard,
  Package,
  Plus,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function FarmerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    revenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    lowStockCount: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData, productsData] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getOrders(),
          apiClient.getProducts()
        ]);

        const backendStats = statsData.stats;
        
        setStats({
          revenue: backendStats.revenue || 0,
          totalOrders: backendStats.total_orders || 0,
          newCustomers: backendStats.customers || 0,
          lowStockCount: backendStats.low_stock_count || 0
        });

        setRecentOrders(ordersData.results.slice(0, 5));
        setLowStockProducts(productsData.results.filter(p => p.quantity < 10).slice(0, 3));
      } catch (error) {
        console.error('Data fetch failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen w-full font-sans pb-20">
      <div className="relative z-10 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-wrap justify-between items-end gap-6 mb-12 dashboard-header rounded-3xl p-8 bg-card/30 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Good Morning, <span className="text-primary">{user?.first_name || 'Partner'}</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Here's a look at your farm's performance today.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/profile">
              <button className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-muted">
                <Users size={16} /> Profile
              </button>
            </Link>
            <button className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-muted">
              Last 30 Days <ChevronDown size={16} />
            </button>
            <Link href="/articles/new">
              <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
                <FileText size={18} />
                Write Article
              </button>
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Revenue Stat */}
          <div className="stat-card group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Revenue</p>
              <BarChart3 className="size-5 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl font-black mb-2">${stats.revenue.toLocaleString()}</p>
            <p className="text-sm font-bold flex items-center gap-1 text-primary">
              <ArrowUp size={14} /> +5.2%
            </p>
          </div>

          {/* Orders Stat */}
          <div className="stat-card group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Orders</p>
              <Package className="size-5 text-secondary group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl font-black mb-2">{stats.totalOrders}</p>
            <p className="text-sm font-bold flex items-center gap-1 text-primary">
              <ArrowUp size={14} /> +8.1%
            </p>
          </div>

          {/* Customers Stat */}
          <div className="stat-card group">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Customers</p>
              <Users className="size-5 text-blue-500 group-hover:scale-110 transition-transform" />
            </div>
            <p className="text-3xl font-black mb-2">{stats.newCustomers}</p>
            <p className="text-sm font-bold flex items-center gap-1 text-primary">
              <ArrowUp size={14} /> +12%
            </p>
          </div>

          {/* Low Stock Alert Stat */}
          <div className="stat-card group border-red-500/30 bg-red-500/5">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-black uppercase tracking-widest text-red-500/80">Alerts</p>
              <AlertTriangle className="size-5 text-red-500 group-hover:scale-110 transition-transform animate-pulse" />
            </div>
            <p className="text-3xl font-black mb-2 text-red-500">{stats.lowStockCount}</p>
            <p className="text-sm font-bold text-red-400">Items Low Stock</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Sales Chart Area */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <div className="glass-card rounded-2xl p-8 border border-border/50 h-full">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-xl font-bold">Sales Performance</h3>
                  <p className="text-muted-foreground text-sm font-medium">Daily revenue insights</p>
                </div>
                <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">+5.2%</div>
              </div>
              <p className="text-4xl font-black mb-12">${stats.revenue.toLocaleString()}</p>
              
              {/* SVG Chart Mockup */}
              <div className="relative h-64 w-full">
                <svg className="w-full h-full" viewBox="0 0 478 150" preserveAspectRatio="none">
                  <path 
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25" 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-primary"
                    strokeWidth="3" 
                  />
                  <path 
                    d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z" 
                    fill="url(#chartGradient)" 
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(96, 75%, 38%)" />
                      <stop offset="100%" stopColor="hsl(96, 75%, 38%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            {/* Low Stock Alerts */}
            <div className="glass-card rounded-2xl p-6 border border-border/50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Low Stock Alerts</h3>
                <AlertTriangle className="text-amber-500" size={20} />
              </div>
              <div className="space-y-4">
                {isLoading ? (
                  [1,2,3].map(i => <div key={i} className="skeleton h-16 w-full" />)
                ) : lowStockProducts.length > 0 ? (
                  lowStockProducts.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-primary/20 transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="size-full object-cover rounded-lg" />
                          ) : (
                            <Package size={16} className="text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[120px]">{item.title}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${item.quantity < 5 ? 'text-red-500' : 'text-amber-500'}`}>
                            {item.quantity} units left
                          </p>
                        </div>
                      </div>
                      <Link href={`/products/${item.id}/edit`}>
                        <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline opacity-0 group-hover:opacity-100 transition-all">Restock</button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 className="mx-auto size-8 text-primary mb-2" />
                    <p className="text-sm text-muted-foreground">Inventory looks good!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions grid-cols-2">
              <Link href="/products/new" className="col-span-1">
                <div className="quick-action-btn">
                  <div className="quick-action-btn-icon">
                    <Plus />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-widest text-center">New Product</p>
                </div>
              </Link>
              <div className="quick-action-btn">
                <div className="quick-action-btn-icon">
                  <LayoutDashboard />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-center">Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="mt-12 glass-card rounded-2xl p-8 border border-border/50">
          <h3 className="text-xl font-bold mb-8">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th className="text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1,2,3].map(i => (
                    <tr key={i}>
                      <td colSpan={4}><div className="skeleton h-12 w-full" /></td>
                    </tr>
                  ))
                ) : recentOrders.map((order, i) => (
                  <tr key={i} className="group hover:bg-muted/10 transition-all cursor-pointer">
                    <td className="font-bold text-sm">Customer #{order.user_id}</td>
                    <td className="text-sm text-muted-foreground">#{order.order_id}</td>
                    <td className="font-black">${order.total_price}</td>
                    <td className="text-right">
                      <span className={`status-badge ${
                        order.status === 'delivered' ? 'status-badge-success' :
                        order.status === 'cancelled' ? 'status-badge-danger' :
                        'status-badge-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

