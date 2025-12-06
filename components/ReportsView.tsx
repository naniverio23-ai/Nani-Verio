import React, { useState, useMemo } from 'react';
import { Sale, Expense } from '../types';
import { BarChart3, Calendar, DollarSign, TrendingUp, ChevronLeft, ChevronRight, Printer, Wallet, PieChart } from 'lucide-react';

interface ReportsViewProps {
  sales: Sale[];
  expenses: Expense[];
}

type ReportPeriod = 'DAILY' | 'MONTHLY' | 'YEARLY';

const ReportsView: React.FC<ReportsViewProps> = ({ sales, expenses }) => {
  const [period, setPeriod] = useState<ReportPeriod>('MONTHLY');
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper to get start and end of periods
  const getDateRange = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    switch (period) {
      case 'DAILY':
        return {
          start: new Date(year, month, day, 0, 0, 0),
          end: new Date(year, month, day, 23, 59, 59),
          label: new Date(year, month, day).toLocaleDateString('km-KH', { dateStyle: 'full' })
        };
      case 'MONTHLY':
        return {
          start: new Date(year, month, 1),
          end: new Date(year, month + 1, 0, 23, 59, 59),
          label: `ខែ ${new Date(year, month).toLocaleDateString('km-KH', { month: 'long' })} ឆ្នាំ ${year}`
        };
      case 'YEARLY':
        return {
          start: new Date(year, 0, 1),
          end: new Date(year, 11, 31, 23, 59, 59),
          label: `ឆ្នាំ ${year}`
        };
    }
  };

  const { start, end, label } = getDateRange();

  // Filter Sales
  const filteredSales = useMemo(() => {
    return sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= start && saleDate <= end;
    });
  }, [sales, start, end]);

  // Filter Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      // Expense dates are YYYY-MM-DD string mostly, sometimes ISO
      const expenseDate = new Date(e.date);
      // We need to account for timezone issues if using simple date strings, 
      // but usually just comparing time values is enough if consistent.
      // Let's set time to middle of day to be safe if only date is provided
      if (e.date.length === 10) expenseDate.setHours(12);
      
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, start, end]);

  // Aggregate stats
  const totalRevenue = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const totalOrders = filteredSales.length;

  // Prepare Expense Breakdown by Category
  const expenseBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    filteredExpenses.forEach(e => {
      breakdown[e.category] = (breakdown[e.category] || 0) + e.amount;
    });
    return Object.entries(breakdown).sort((a, b) => b[1] - a[1]);
  }, [filteredExpenses]);

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      'Marketing': 'ផ្សព្វផ្សាយ',
      'Staff': 'បុគ្គលិក',
      'Rent': 'ជួលទីតាំង',
      'Utilities': 'ទឹកភ្លើង',
      'Others': 'ផ្សេងៗ'
    };
    return map[cat] || cat;
  };

  // Prepare Chart Data
  const chartData = useMemo(() => {
    const data: { label: string; income: number; expense: number; date: Date }[] = [];
    
    if (period === 'DAILY') {
      for (let i = 0; i < 24; i++) {
        data.push({ 
          label: `${i}:00`, 
          income: 0, 
          expense: 0,
          date: new Date(start.getFullYear(), start.getMonth(), start.getDate(), i)
        });
      }
      filteredSales.forEach(s => {
        const hour = new Date(s.date).getHours();
        if (data[hour]) data[hour].income += s.total;
      });
      // Daily expense chart might be sparse if expenses are date-only not time, but we try
      filteredExpenses.forEach(e => {
        const d = new Date(e.date);
        // If expense has no time, it defaults to 00:00 (GMT) or similar. 
        // For daily view, expenses are usually just "on that day". 
        // We might just show them spread or ignore time for chart? 
        // For simplicity in Daily view, maybe only show income vs expense summary.
        // Or if it has time, plot it. If YYYY-MM-DD, it falls to 7am usually (local).
        const hour = d.getHours();
        // Only plot if it matches the day exactly
        if (d.getDate() === start.getDate() && data[hour]) {
            data[hour].expense += e.amount;
        }
      });
    } else if (period === 'MONTHLY') {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        data.push({ 
          label: `${i}`, 
          income: 0,
          expense: 0,
          date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
        });
      }
      filteredSales.forEach(s => {
        const day = new Date(s.date).getDate();
        if (data[day - 1]) data[day - 1].income += s.total;
      });
      filteredExpenses.forEach(e => {
        const day = new Date(e.date).getDate();
        if (data[day - 1]) data[day - 1].expense += e.amount;
      });
    } else {
      const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
      for (let i = 0; i < 12; i++) {
        data.push({ 
          label: khmerMonths[i], 
          income: 0,
          expense: 0,
          date: new Date(currentDate.getFullYear(), i, 1)
        });
      }
      filteredSales.forEach(s => {
        const month = new Date(s.date).getMonth();
        if (data[month]) data[month].income += s.total;
      });
      filteredExpenses.forEach(e => {
        const month = new Date(e.date).getMonth();
        if (data[month]) data[month].expense += e.amount;
      });
    }
    return data;
  }, [filteredSales, filteredExpenses, period, start, currentDate]);

  // Find max value for scaling chart
  const maxChartValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expense)), 
    1
  );

  // Navigation handlers
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (period === 'DAILY') newDate.setDate(newDate.getDate() - 1);
    if (period === 'MONTHLY') newDate.setMonth(newDate.getMonth() - 1);
    if (period === 'YEARLY') newDate.setFullYear(newDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (period === 'DAILY') newDate.setDate(newDate.getDate() + 1);
    if (period === 'MONTHLY') newDate.setMonth(newDate.getMonth() + 1);
    if (period === 'YEARLY') newDate.setFullYear(newDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          @page { margin: 0.5cm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="text-blue-600" />
          របាយការណ៍អាជីវកម្ម
        </h1>
        
        <div className="flex gap-2">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200 print:hidden">
            {(['DAILY', 'MONTHLY', 'YEARLY'] as ReportPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  period === p ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p === 'DAILY' ? 'ប្រចាំថ្ងៃ' : p === 'MONTHLY' ? 'ប្រចាំខែ' : 'ប្រចាំឆ្នាំ'}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors shadow-sm print:hidden"
          >
            <Printer size={18} />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <button onClick={handlePrev} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 print:hidden">
          <ChevronLeft />
        </button>
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          {label}
        </h2>
        <button onClick={handleNext} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 print:hidden">
          <ChevronRight />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg print:border print:border-gray-300 print:shadow-none">
          <p className="text-blue-100 text-sm mb-1 print:text-white">ចំណូលសរុប (Revenue)</p>
          <h3 className="text-2xl font-bold">{formatCurrency(totalRevenue)}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:border-gray-300">
           <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">ចំណាយសរុប (Expenses)</p>
              <h3 className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-lg print:bg-gray-100">
              <Wallet className="text-red-600 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">ចំណេញសុទ្ធ (Net Profit)</p>
              <h3 className={`text-2xl font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit)}
              </h3>
            </div>
            <div className="bg-emerald-100 p-2 rounded-lg print:bg-gray-100">
              <PieChart className="text-emerald-600 w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 print:border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">ចំនួនលក់ (Orders)</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalOrders}</h3>
            </div>
            <div className="bg-orange-100 p-2 rounded-lg print:bg-gray-100">
              <TrendingUp className="text-orange-600 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-gray-800 mb-6">ក្រាហ្វិកចំណូល vs ចំណាយ</h3>
          <div className="h-64 flex items-end gap-2 overflow-x-auto pb-2">
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1 min-w-[30px] group">
                <div className="relative w-full flex justify-center h-full items-end gap-0.5">
                  {/* Income Bar */}
                  <div 
                    className={`w-1/2 rounded-t-sm transition-all duration-500 ${d.income > 0 ? 'bg-blue-500' : 'bg-transparent'}`}
                    style={{ height: d.income > 0 ? `${(d.income / maxChartValue) * 100}%` : '0px' }}
                    title={`ចំណូល: ${d.income}`}
                  ></div>
                  {/* Expense Bar */}
                  <div 
                    className={`w-1/2 rounded-t-sm transition-all duration-500 ${d.expense > 0 ? 'bg-red-400' : 'bg-transparent'}`}
                    style={{ height: d.expense > 0 ? `${(d.expense / maxChartValue) * 100}%` : '0px' }}
                     title={`ចំណាយ: ${d.expense}`}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500 rotate-0 truncate w-full text-center">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
              <span>ចំណូល</span>
            </div>
             <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
              <span>ចំណាយ</span>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:break-inside-avoid">
          <h3 className="text-lg font-bold text-gray-800 mb-4">ប្រភេទចំណាយ</h3>
          <div className="space-y-4">
            {expenseBreakdown.length > 0 ? expenseBreakdown.map(([cat, amount], index) => (
              <div key={index} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-gray-100 text-gray-600`}>
                    {((amount / totalExpenses) * 100).toFixed(0)}%
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{getCategoryLabel(cat)}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-red-600">{formatCurrency(amount)}</span>
              </div>
            )) : (
              <p className="text-center text-gray-400 py-8 text-sm">មិនមានទិន្នន័យចំណាយ</p>
            )}
          </div>
        </div>
      </div>

      <div className="hidden print:block text-center text-xs text-gray-400 mt-8">
        របាយការណ៍នេះបង្កើតដោយប្រព័ន្ធ Khmer Stock Master នៅថ្ងៃទី {new Date().toLocaleDateString('km-KH')}
      </div>
    </div>
  );
};

export default ReportsView;