import React, { useState } from 'react';
import { Expense } from '../types';
import { Wallet, Plus, Search, Edit, Trash2, Tag, Calendar } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

interface ExpensesViewProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onEditExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, onAddExpense, onEditExpense, onDeleteExpense }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបការចំណាយនេះមែនទេ?')) {
      onDeleteExpense(id);
    }
  };

  const handleFormSubmit = (data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      onEditExpense(editingExpense.id, data);
    } else {
      onAddExpense(data);
    }
    setIsFormOpen(false);
    setEditingExpense(undefined);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          e.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      'Marketing': 'bg-purple-100 text-purple-700',
      'Staff': 'bg-blue-100 text-blue-700',
      'Rent': 'bg-orange-100 text-orange-700',
      'Utilities': 'bg-yellow-100 text-yellow-700',
      'Others': 'bg-gray-100 text-gray-700'
    };
    return map[cat] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-800">ការចំណាយ (Expenses)</h1>
        
        <div className="flex flex-wrap gap-2 print:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="ស្វែងរក..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none w-full md:w-48"
            />
          </div>
          
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white text-sm"
          >
            <option value="ALL">ទាំងអស់</option>
            <option value="Marketing">ផ្សព្វផ្សាយ</option>
            <option value="Staff">បុគ្គលិក</option>
            <option value="Rent">ជួលទីតាំង</option>
            <option value="Utilities">ទឹកភ្លើង</option>
            <option value="Others">ផ្សេងៗ</option>
          </select>

          <button 
            onClick={() => { setEditingExpense(undefined); setIsFormOpen(true); }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden md:inline">បន្ថែមចំណាយ</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
              <tr>
                <th className="p-4 font-semibold">កាលបរិច្ឆេទ</th>
                <th className="p-4 font-semibold">ឈ្មោះចំណាយ</th>
                <th className="p-4 font-semibold">ប្រភេទ</th>
                <th className="p-4 font-semibold text-right">ទឹកប្រាក់</th>
                <th className="p-4 font-semibold text-right print:hidden">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredExpenses.length > 0 ? filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(e.date).toLocaleDateString('km-KH')}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-900">{e.title}</p>
                    {e.description && <p className="text-xs text-gray-400 mt-0.5">{e.description}</p>}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(e.category)}`}>
                      <Tag size={10} />
                      {getCategoryLabel(e.category)}
                    </span>
                  </td>
                  <td className="p-4 text-right font-bold text-red-600">
                    -${e.amount.toFixed(2)}
                  </td>
                  <td className="p-4 text-right print:hidden">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEditClick(e)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(e.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                    <Wallet size={48} className="mb-4 opacity-50" />
                    <p>មិនទាន់មានទិន្នន័យចំណាយទេ។</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <ExpenseForm 
          initialData={editingExpense} 
          onSubmit={handleFormSubmit} 
          onCancel={() => { setIsFormOpen(false); setEditingExpense(undefined); }} 
        />
      )}
    </div>
  );
};

export default ExpensesView;