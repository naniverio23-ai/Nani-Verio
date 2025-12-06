import React, { useState, useEffect } from 'react';
import { Product, Sale } from '../types';
import { X, ShoppingCart, DollarSign, Save } from 'lucide-react';

interface SalesFormProps {
  products: Product[];
  initialData?: Sale;
  onSubmit: (saleData: Omit<Sale, 'id' | 'date' | 'productName'>) => void;
  onCancel: () => void;
}

const SalesForm: React.FC<SalesFormProps> = ({ products, initialData, onSubmit, onCancel }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [salePrice, setSalePrice] = useState(0); // New state for editable price
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (initialData) {
      setSelectedProductId(initialData.productId);
      setQuantity(initialData.quantity);
      setSalePrice(initialData.salePrice); // Load saved price
      const product = products.find(p => p.id === initialData.productId);
      setSelectedProduct(product || null);
    }
  }, [initialData, products]);

  useEffect(() => {
    if (selectedProductId) {
      const product = products.find(p => p.id === selectedProductId);
      setSelectedProduct(product || null);
      
      // If we are NOT loading initial data, OR if we switched to a different product than the one in initialData
      if (!initialData || (initialData && initialData.productId !== selectedProductId)) {
        setQuantity(1);
        if (product) {
          setSalePrice(product.price); // Default to product price
        }
      }
    }
  }, [selectedProductId, products]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && quantity > 0) {
      onSubmit({
        productId: selectedProduct.id,
        quantity: quantity,
        salePrice: salePrice, // Use the edited price
        total: salePrice * quantity // Calculate total based on edited price
      });
    }
  };

  const totalAmount = salePrice * quantity;

  // Calculate max available. 
  // If editing same product: Current Stock + Old Sale Qty
  // If new sale or different product: Current Stock
  const maxAvailable = selectedProduct 
    ? (initialData && initialData.productId === selectedProduct.id 
        ? selectedProduct.quantity + initialData.quantity 
        : selectedProduct.quantity)
    : 0;

  // Filter products for dropdown: 
  // ONLY show if quantity > 0 OR if it's the product we are currently editing in a past sale record.
  const productOptions = products.filter(p => p.quantity > 0 || (initialData && p.id === initialData.productId));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <ShoppingCart className="text-blue-600" />
            {initialData ? 'កែប្រែការលក់' : 'កត់ត្រាការលក់'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ជ្រើសរើសម៉ូតូ / ផលិតផល</label>
            <select
              required
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- សូមជ្រើសរើស --</option>
              {productOptions.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.year ? `(${p.year})` : ''} {p.plateNumber ? `[${p.plateNumber}]` : ''} {p.color ? `- ${p.color}` : ''} | សល់: {p.quantity} | ${p.price}
                </option>
              ))}
            </select>
          </div>

          {selectedProduct && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃលក់ឯកតា ($)</label>
                   <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800"
                  />
                  <p className="text-xs text-gray-400 mt-1">តម្លៃដើម: ${selectedProduct.price}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">បរិមាណលក់</label>
                  <input
                    type="number"
                    min="1"
                    max={maxAvailable}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                  <span>ស្តុកបច្ចុប្បន្ន: {selectedProduct.quantity}</span>
                  <span>អាចលក់បានអតិបរមា: {maxAvailable}</span>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                <span className="text-gray-700 font-medium">សរុបទឹកប្រាក់:</span>
                <div className="flex items-center text-xl font-bold text-blue-700">
                  <DollarSign size={20} />
                  {totalAmount.toFixed(2)}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={!selectedProduct || quantity > maxAvailable}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={18} />
              {initialData ? 'រក្សាទុកការកែប្រែ' : 'បញ្ជាក់ការលក់'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesForm;