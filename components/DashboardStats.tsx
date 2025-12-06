import React from 'react';
import { Product, Sale, Expense } from '../types';
import { Package, DollarSign, AlertTriangle, TrendingUp, Wallet, PieChart } from 'lucide-react';

interface DashboardStatsProps {
  products: Product[];
  sales?: Sale[];
  expenses?: Expense[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ products, sales = [], expenses = [] }) => {
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.quantity, 0);
  const lowStockCount = products.filter(p => p.quantity < 10).length;
  
  // Financials
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;

  const StatCard = ({ title, value, icon: Icon, color, subValue, textColor }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-transform hover:scale-105 duration-200">
      <div>
        <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
        <h3 className={`text-2xl font-bold ${textColor || 'text-gray-800'}`}>{value}</h3>
        {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
      </div>
      <div className={`p-4 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="ចំណូលសរុប"
        value={`$${totalRevenue.toFixed(2)}`}
        icon={TrendingUp}
        color="bg-purple-500"
        subValue={`${sales.length} វិក្កយបត្រ`}
      />
      <StatCard
        title="ចំណាយសរុប"
        value={`$${totalExpenses.toFixed(2)}`}
        icon={Wallet}
        color="bg-orange-500"
        subValue={`${expenses.length} ប្រតិបត្តិការ`}
      />
      <StatCard
        title="ប្រាក់ចំណេញសុទ្ធ"
        value={`$${netProfit.toFixed(2)}`}
        icon={PieChart}
        color={netProfit >= 0 ? "bg-emerald-500" : "bg-red-500"}
        textColor={netProfit >= 0 ? "text-emerald-600" : "text-red-600"}
      />
      <StatCard
        title="ស្តុកជិតអស់"
        value={lowStockCount}
        icon={AlertTriangle}
        color="bg-red-500"
        subValue="តិចជាង ១០"
      />
    </div>
  );
};

export default DashboardStats;