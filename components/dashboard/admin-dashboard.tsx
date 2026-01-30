'use client';

import apiClient, { Order } from '@/lib/api-client';
import { useAuth } from '@/lib/auth-context';
import {
    BarChart,
    Lock,
    Settings,
    ShieldCheck,
    Trash2,
    TrendingUp,
    Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    newMembers: 124, // Mock
    engagement: 315, // Mock
    charityFund: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, ordersData] = await Promise.all([
          apiClient.getDashboardStats(),
          apiClient.getOrders()
        ]);
        
        const s = statsData.stats;
        setStats({
          totalSales: s.total_sales || 0,
          newMembers: s.total_users || 0,
          engagement: 315, // Keep mock for now
          charityFund: s.charity_fund || 0
        });

        setRecentOrders(ordersData.results.slice(0, 5));
      } catch (error) {
        console.error('Admin data fetch failed', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen w-full font-sans pb-20">
      <div className="relative z-10 p-4 md:p-12 lg:p-16 max-w-7xl mx-auto">
        <header className="flex flex-wrap justify-between items-end gap-8 mb-12 dashboard-header rounded-3xl p-8 bg-card/30 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Platform <span className="text-primary">Ops</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium">Global oversight and community integrity management.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard/profile">
              <button className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-muted">
                <Users size={18} />
                Profile
              </button>
            </Link>
            <button className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-xl text-sm font-bold transition-all hover:bg-muted">
              <Settings size={18} />
              Config
            </button>
          </div>
        </header>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="stat-card group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Total Sales</p>
            <p className="text-4xl font-black mb-2">${stats.totalSales.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <p className="text-sm font-black text-primary">+5.2%</p>
            </div>
          </div>

          <div className="stat-card group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">New Members</p>
            <p className="text-4xl font-black mb-2">{stats.newMembers}</p>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-blue-500" />
              <p className="text-sm font-black text-blue-500">+12%</p>
            </div>
          </div>

          <div className="stat-card group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Engagement</p>
            <p className="text-4xl font-black mb-2">{stats.engagement}</p>
            <div className="flex items-center gap-2">
              <BarChart className="size-4 text-amber-500" />
              <p className="text-sm font-black text-amber-500">-1.5%</p>
            </div>
          </div>

          <div className="stat-card group">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">Charity Fund</p>
            <p className="text-4xl font-black mb-2">${stats.charityFund.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <p className="text-sm font-black text-primary">+8%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-12">
          {/* Main Analytics Area */}
          <div className="col-span-12 lg:col-span-8">
            <div className="glass-card rounded-2xl p-8 border border-border/50 h-full">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-widest">Sales Velocity</h3>
                  <p className="text-muted-foreground text-sm font-medium mt-1">Real-time platform throughput</p>
                </div>
                <div className="text-primary text-sm font-black uppercase tracking-widest">+5.2%</div>
              </div>
              
              {/* Line Chart Mockup */}
              <div className="h-64 flex items-end gap-1">
                {[40, 60, 45, 90, 120, 80, 100, 150, 130, 180, 200, 220, 190, 240, 260].map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/50 transition-all rounded-t-sm" style={{ height: `${(h/260)*100}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Breakdown Sidebar */}
          <div className="col-span-12 lg:col-span-4">
            <div className="glass-card rounded-2xl p-8 border border-border/50 h-full">
              <h3 className="text-xl font-black uppercase tracking-widest mb-8">Fund Breakdown</h3>
              <div className="flex justify-center mb-12">
                <div className="size-48 rounded-full border-[12px] border-primary/20 border-t-primary border-r-blue-500 border-b-amber-500 relative flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-black">${stats.charityFund.toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Total</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Local Missions', pct: '45%', color: 'bg-primary' },
                  { label: 'Community Aid', pct: '30%', color: 'bg-blue-500' },
                  { label: 'Building Fund', pct: '25%', color: 'bg-amber-500' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`size-3 rounded-full ${item.color}`}></div>
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                    <span className="text-xs font-black">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Platform Activity Table */}
        <div className="glass-card rounded-2xl border border-border/50 overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-border/50">
            <h3 className="text-2xl font-black">Recent Transactions</h3>
            <p className="text-muted-foreground text-sm font-medium mt-1">Live feed of global platform activity.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Order ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                    [1,2,3].map(i => <tr key={i}><td colSpan={5}><div className="skeleton h-12 w-full" /></td></tr>)
                ) : recentOrders.map((row, i) => (
                  <tr key={i} className="group hover:bg-muted/10 transition-all">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                          {row.user_id}
                        </div>
                        <span className="font-bold text-sm">User #{row.user_id}</span>
                      </div>
                    </td>
                    <td className="text-sm font-medium">#{row.order_id}</td>
                    <td>
                      <span className="font-black text-primary">${row.total_price}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${
                        row.status === 'delivered' ? 'status-badge-success' :
                        row.status === 'cancelled' ? 'status-badge-danger' :
                        'status-badge-warning'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <Lock size={16} />
                        </button>
                        <button className="text-red-500 hover:scale-110 transition-transform">
                            <Trash2 size={16} />
                        </button>
                      </div>
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

