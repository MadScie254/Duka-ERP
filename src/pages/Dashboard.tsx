import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, ShoppingBag, CreditCard, PackageOpen } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock Data Service
const fetchDashboardData = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    kpis: {
      revenue: 125000,
      salesCount: 142,
      debtCollected: 15000,
      stockValue: 450000,
    },
    revenueTrend: [
      { name: 'Mon', value: 12000 },
      { name: 'Tue', value: 15000 },
      { name: 'Wed', value: 18000 },
      { name: 'Thu', value: 14000 },
      { name: 'Fri', value: 22000 },
      { name: 'Sat', value: 35000 },
      { name: 'Sun', value: 9000 },
    ],
    topProducts: [
      { name: 'Unga wa Dola 2kg', sales: 45 },
      { name: 'Supa Loaf 400g', sales: 38 },
      { name: 'Menengai Soap 1kg', sales: 25 },
      { name: 'KCC Milk 500ml', sales: 60 },
      { name: 'Sugar 1kg', sales: 30 },
    ],
    paymentMethods: [
      { name: 'M-PESA', value: 85000 },
      { name: 'CASH', value: 30000 },
      { name: 'MKOPO', value: 10000 },
    ],
    expenses: [
      { name: 'Rent', value: 20000 },
      { name: 'Transport', value: 5000 },
      { name: 'Wages', value: 15000 },
      { name: 'Utilities', value: 3000 },
    ],
    debtAging: [
      { name: '0-30 Days', value: 25000 },
      { name: '31-60 Days', value: 12000 },
      { name: '61-90 Days', value: 5000 },
      { name: '>90 Days', value: 2000 },
    ],
    salesHeatmap: Array.from({ length: 7 }, (_, day) => 
      Array.from({ length: 12 }, (_, hour) => ({
        day,
        hour: hour + 8, // 8 AM to 8 PM
        value: Math.floor(Math.random() * 100),
      }))
    ).flat(),
  };
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: fetchDashboardData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your shop's performance today</p>
      </div>

      {/* Row 1: KPI Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Revenue" value={formatCurrency(data.kpis.revenue)} icon={TrendingUp} color="text-emerald-600" bg="bg-emerald-100" />
        <KpiCard title="Sales Count" value={data.kpis.salesCount.toString()} icon={ShoppingBag} color="text-blue-600" bg="bg-blue-100" />
        <KpiCard title="Debt Collected" value={formatCurrency(data.kpis.debtCollected)} icon={CreditCard} color="text-amber-600" bg="bg-amber-100" />
        <KpiCard title="Stock Value" value={formatCurrency(data.kpis.stockValue)} icon={PackageOpen} color="text-purple-600" bg="bg-purple-100" />
      </div>

      {/* Row 2: Revenue Trend + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend (This Week)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `KSh ${val/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
            {data.topProducts.map((product, idx) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 mr-3">
                    {idx + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{product.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{product.sales} sold</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Payment Methods + Expense Breakdown + Sales Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.paymentMethods.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            {data.paymentMethods.map((entry, index) => (
              <div key={entry.name} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.expenses} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Sales Heatmap</h3>
          <p className="text-xs text-gray-500 mb-4">Busiest hours (Mon-Sun, 8AM-8PM)</p>
          <div className="grid grid-cols-12 gap-1">
            {/* Simple heatmap visualization */}
            {data.salesHeatmap.map((cell, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-sm"
                style={{ 
                  backgroundColor: `rgba(16, 185, 129, ${cell.value / 100})`,
                  opacity: cell.value < 10 ? 0.1 : 1
                }}
                title={`Day ${cell.day}, ${cell.hour}:00 - Intensity: ${cell.value}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>8 AM</span>
            <span>2 PM</span>
            <span>8 PM</span>
          </div>
        </div>
      </div>

      {/* Row 4: Debt Aging + Stock Valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Debt Aging (Mkopo)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.debtAging}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <PackageOpen className="w-16 h-16 text-purple-200 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Total Stock Valuation</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">{formatCurrency(data.kpis.stockValue)}</p>
          <p className="text-sm text-gray-500 mt-2">Based on current buying prices</p>
          <button className="mt-6 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium text-sm hover:bg-purple-100 transition-colors">
            View Inventory Report
          </button>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, bg }: { title: string, value: string, icon: any, color: string, bg: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} ${color} mr-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
