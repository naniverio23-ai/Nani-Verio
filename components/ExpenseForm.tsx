import React, { useState, useEffect } from 'react';
import { Expense } from '../types';
import { X, Save, Wallet } from 'lucide-react';

interface ExpenseFormProps {
  initialData?: Expense;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    title: '',
    category: 'Others',
    amount: 0,
    date: new Date().toISOString().split('T')[0], // Default to today YYYY-MM-DD
    description: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        category: initialData.category,
        amount: initialData.amount,
        date: new Date(initialData.date).toISOString().split('T')[0],
        description: initialData.description || '',
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="text-red-600" />
            {initialData ? 'កែប្រែការចំណាយ' : 'កត់ត្រាការចំណាយ'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះចំណាយ</label>
            <input
              required
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="ឧ. បង់ថ្លៃទឹកភ្លើង"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទចំណាយ</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="Marketing">ផ្សព្វផ្សាយ (Marketing)</option>
                <option value="Staff">បុគ្គលិក (Salary)</option>
                <option value="Rent">ជួលទីតាំង (Rent)</option>
                <option value="Utilities">ទឹកភ្លើង (Utilities)</option>
                <option value="Others">ផ្សេងៗ (Others)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួនទឹកប្រាក់ ($)</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none font-bold text-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">កាលបរិច្ឆេទ</label>
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">បរិយាយ (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-2 border-t mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'រក្សាទុក' : 'បន្ថែមចំណាយ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;