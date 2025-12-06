import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { X, Sparkles, Save, Calendar, Hash, Palette, FileText } from 'lucide-react';
import { generateProductDescription } from '../services/geminiService';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: '',
    price: 0,
    cost: 0,
    quantity: 1, // Default quantity for a bike is usually 1
    sku: '',
    description: '',
    plateNumber: '',
    color: '',
    year: new Date().getFullYear().toString(),
    dateAdded: new Date().toISOString().split('T')[0],
    condition: 'ក្រដាសពន្ធថ្មី', // Default value
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure dateAdded is formatted for input type="date"
        dateAdded: initialData.dateAdded ? initialData.dateAdded.split('T')[0] : new Date().toISOString().split('T')[0],
        condition: initialData.condition || 'ក្រដាសពន្ធថ្មី'
      });
    } else {
      // Generate a random SKU for new products internally (hidden from user now)
      setFormData(prev => ({
        ...prev,
        sku: `MOTO-${Math.floor(Math.random() * 10000)}`
      }));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      alert("សូមបញ្ចូលឈ្មោះ និង ប្រភេទផលិតផលជាមុនសិន!");
      return;
    }
    setIsGenerating(true);
    // Include color and year in the prompt if available
    const details = `${formData.year ? `Year ${formData.year}` : ''} ${formData.color ? `Color ${formData.color}` : ''} ${formData.condition ? `Condition: ${formData.condition}` : ''}`;
    const desc = await generateProductDescription(`${formData.name} ${details}`, formData.category!);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.price !== undefined) {
      onSubmit({
        ...formData,
        id: initialData?.id || crypto.randomUUID(),
        lastUpdated: new Date().toISOString(),
      } as Product);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'កែប្រែព័ត៌មានម៉ូតូ' : 'បន្ថែមម៉ូតូថ្មី'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Main Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះម៉ូតូ / ផលិតផល</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="ឧ. Honda Dream 2025"
              />
            </div>
            
            {/* New Fields for Motorcycle Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Hash size={14} /> ផ្លាកលេខ (Plate Number)
              </label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                placeholder="ឧ. 1AA-9999 (ទុកទំនេរបាន)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-yellow-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Palette size={14} /> ពណ៌ (Color)
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="ឧ. ខ្មៅ (Black)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Calendar size={14} /> ឆ្នាំផលិត (Year)
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="ឧ. 2025"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ថ្ងៃខែចូលស្តុក (Date Added)</label>
              <input
                type="date"
                name="dateAdded"
                value={formData.dateAdded}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Existing Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទ / យីហោ</label>
              <select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">ជ្រើសរើសប្រភេទ (Brand)</option>
                <option value="Honda">Honda</option>
                <option value="Yamaha">Yamaha</option>
                <option value="Suzuki">Suzuki</option>
                <option value="Kawasaki">Kawasaki</option>
                <option value="TVS">TVS</option>
                <option value="Bajaj">Bajaj</option>
                <option value="Electric">ម៉ូតូអគ្គិសនី (Electric)</option>
                <option value="Spare Parts">គ្រឿងបន្លាស់ (Spare Parts)</option>
                <option value="Accessories">គ្រឿងតុបតែង (Accessories)</option>
                <option value="Others">ផ្សេងៗ (Others)</option>
              </select>
            </div>

            {/* Replaced SKU with Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FileText size={14} /> ស្ថានភាព / ឯកសារ
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50"
              >
                <option value="ក្រដាសពន្ធថ្មី">ក្រដាសពន្ធថ្មី (New Tax Paper)</option>
                <option value="ក្រដាសពន្ធមួយទឹក">ក្រដាសពន្ធមួយទឹក (Used Tax Paper)</option>
                <option value="មួយទឹកផ្លាកលេខ">មួយទឹកផ្លាកលេខ (Used with Plate)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃដើម ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃលក់ ($)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">បរិមាណ (Quantity)</label>
              <input
                type="number"
                min="0"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">ការពិពណ៌នា</label>
              <button
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:opacity-50"
              >
                <Sparkles size={14} />
                {isGenerating ? 'កំពុងបង្កើត...' : 'ប្រើ AI បង្កើត'}
              </button>
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ព័ត៌មានលម្អិតអំពីម៉ូតូ (ស៊េរីឆ្នាំ, ពណ៌, លក្ខណៈពិសេស)..."
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;