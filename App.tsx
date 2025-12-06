import React, { useState, useEffect } from 'react';
import { Product, Sale, Expense, ViewState } from './types';
import DashboardStats from './components/DashboardStats';
import ProductForm from './components/ProductForm';
import SalesForm from './components/SalesForm';
import ExpensesView from './components/ExpensesView';
import AIAssistant from './components/AIAssistant';
import ReportsView from './components/ReportsView';
import { 
  LayoutDashboard, 
  PackageSearch, 
  MessageSquareMore, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Menu,
  ChevronRight,
  ShoppingBag,
  History,
  BarChart3,
  Wallet,
  Eye,
  EyeOff
} from 'lucide-react';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [viewState, setViewState] = useState<ViewState>(ViewState.DASHBOARD);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSalesFormOpen, setIsSalesFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [editingSale, setEditingSale] = useState<Sale | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showOutOfStock, setShowOutOfStock] = useState(false); // Default: Hide out of stock

  // Load data from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem('khmer_stock_products');
    const savedSales = localStorage.getItem('khmer_stock_sales');
    const savedExpenses = localStorage.getItem('khmer_stock_expenses');
    
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products", e);
      }
    } else {
      // Dummy data for Motorcycle Shop
      setProducts([
        { 
          id: '1', 
          name: 'Honda Dream', 
          category: 'Honda', 
          price: 2650.00, 
          cost: 2450.00, 
          quantity: 2, 
          sku: 'HD-2025-BLK', 
          description: 'ម៉ូតូ Honda Dream ស៊េរីថ្មីឆ្នាំ 2025', 
          lastUpdated: new Date().toISOString(),
          plateNumber: '1AA-9999',
          color: 'ខ្មៅ',
          year: '2025',
          dateAdded: '2024-11-01',
          condition: 'មួយទឹកផ្លាកលេខ'
        },
        { 
          id: '2', 
          name: 'Honda Scoopy Prestige', 
          category: 'Honda', 
          price: 2750.00, 
          cost: 2600.00, 
          quantity: 1, 
          sku: 'SC-PRES-WHT', 
          description: 'Scoopy Prestige Smart Key ស៊េរីថ្មី', 
          lastUpdated: new Date().toISOString(),
          plateNumber: '',
          color: 'ស',
          year: '2024',
          dateAdded: '2024-12-15',
          condition: 'ក្រដាសពន្ធថ្មី'
        },
        { 
          id: '3', 
          name: 'Yamaha X-Ride', 
          category: 'Yamaha', 
          price: 1900.00, 
          cost: 1750.00, 
          quantity: 3, 
          sku: 'YM-XR-BLU', 
          description: 'ម៉ូតូ Yamaha X-Ride សម្រាប់ការបើកបរផ្លូវលំបាក', 
          lastUpdated: new Date().toISOString(),
          plateNumber: '',
          color: 'ខៀវ',
          year: '2023',
          dateAdded: '2024-10-20',
          condition: 'ក្រដាសពន្ធមួយទឹក'
        },
        { 
          id: '4', 
          name: 'មួកសុវត្ថិភាព HJC', 
          category: 'Accessories', 
          price: 45.00, 
          cost: 25.00, 
          quantity: 50, 
          sku: 'ACC-HJC', 
          description: 'មួកការពារសុវត្ថិភាពស្តង់ដារ', 
          lastUpdated: new Date().toISOString(),
          year: '2024',
          dateAdded: '2024-01-10',
          condition: 'ក្រដាសពន្ធថ្មី'
        },
        { 
          id: '5', 
          name: 'ប្រេងម៉ាស៊ីន Motul', 
          category: 'Spare Parts', 
          price: 12.00, 
          cost: 8.00, 
          quantity: 100, 
          sku: 'OIL-MTL', 
          description: 'ប្រេងម៉ាស៊ីនគុណភាពខ្ពស់', 
          lastUpdated: new Date().toISOString(),
          dateAdded: '2024-05-05',
          condition: 'ក្រដាសពន្ធថ្មី'
        },
      ]);
    }

    if (savedSales) {
      try {
        setSales(JSON.parse(savedSales));
      } catch (e) {
        console.error("Failed to parse sales", e);
      }
    }

    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (e) {
        console.error("Failed to parse expenses", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('khmer_stock_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('khmer_stock_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('khmer_stock_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleAddProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setIsFormOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបផលិតផលនេះមែនទេ?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleEditSaleClick = (sale: Sale) => {
    setEditingSale(sale);
    setIsSalesFormOpen(true);
  };

  const handleDeleteSale = (saleId: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបការលក់នេះមែនទេ? ស្តុកនឹងត្រូវបានបង្វិលសងវិញ។')) {
      const saleToDelete = sales.find(s => s.id === saleId);
      if (saleToDelete) {
        // Return stock
        setProducts(prev => prev.map(p => {
          if (p.id === saleToDelete.productId) {
            return { ...p, quantity: p.quantity + saleToDelete.quantity };
          }
          return p;
        }));
        // Remove sale
        setSales(prev => prev.filter(s => s.id !== saleId));
      }
    }
  };

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'date' | 'productName'>) => {
    if (editingSale) {
      // 1. Logic for Editing an existing sale
      
      // First, restore stock for the old sale data
      const oldSale = editingSale;
      let tempProducts = [...products];
      
      // Restore stock to the original product
      tempProducts = tempProducts.map(p => {
        if (p.id === oldSale.productId) {
          return { ...p, quantity: p.quantity + oldSale.quantity };
        }
        return p;
      });

      // Now, check if we can fulfill the new sale data from the "restored" stock
      const targetProductIndex = tempProducts.findIndex(p => p.id === saleData.productId);
      
      if (targetProductIndex === -1) {
        alert("Product not found!");
        return;
      }

      if (tempProducts[targetProductIndex].quantity < saleData.quantity) {
        alert("Stock insufficient for the new quantity!");
        return;
      }

      // Deduct new quantity
      tempProducts[targetProductIndex] = {
        ...tempProducts[targetProductIndex],
        quantity: tempProducts[targetProductIndex].quantity - saleData.quantity
      };

      // Update Products State
      setProducts(tempProducts);

      // Update Sales State
      setSales(prev => prev.map(s => {
        if (s.id === editingSale.id) {
          return {
            ...s,
            ...saleData,
            productName: tempProducts[targetProductIndex].name, // Update name in case product changed
            plateNumber: tempProducts[targetProductIndex].plateNumber // Update plate number
          };
        }
        return s;
      }));

    } else {
      // 2. Logic for New Sale (Existing logic)
      const product = products.find(p => p.id === saleData.productId);
      if (!product) return;

      const newSale: Sale = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        productName: product.name,
        plateNumber: product.plateNumber, // Save the plate number to the sale record
        ...saleData
      };

      setSales(prev => [newSale, ...prev]);
      setProducts(prev => prev.map(p => {
        if (p.id === saleData.productId) {
          return { ...p, quantity: p.quantity - saleData.quantity };
        }
        return p;
      }));
    }

    setIsSalesFormOpen(false);
    setEditingSale(undefined);
  };

  // Expense Handlers
  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: crypto.randomUUID()
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleEditExpense = (id: string, expenseData: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...expenseData, id } : e));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Filter Logic:
  // 1. Search term
  // 2. Out of stock visibility
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.plateNumber && p.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.condition && p.condition.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStock = showOutOfStock ? true : p.quantity > 0;

    return matchesSearch && matchesStock;
  });

  const filteredSales = sales.filter(s => 
    s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.plateNumber && s.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const renderContent = () => {
    switch (viewState) {
      case ViewState.DASHBOARD:
        return (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">ផ្ទាំងគ្រប់គ្រង (Dashboard)</h1>
            <DashboardStats products={products} sales={sales} expenses={expenses} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">ម៉ូតូ/ផលិតផលថ្មីៗ</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                      <tr>
                        <th className="p-3 rounded-l-lg">ឈ្មោះ</th>
                        <th className="p-3">ប្រភេទ</th>
                        <th className="p-3 rounded-r-lg">ស្តុក</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 5).map(p => (
                        <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-medium text-gray-800">
                             {p.name} {p.year && <span className="text-xs text-gray-500">({p.year})</span>}
                             {p.plateNumber && <span className="block text-[10px] text-gray-400">{p.plateNumber}</span>}
                          </td>
                          <td className="p-3 text-gray-500">{p.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              p.quantity < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                            }`}>
                              {p.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Sales */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">ការលក់ថ្មីៗ</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-sm">
                      <tr>
                        <th className="p-3 rounded-l-lg">ឈ្មោះ</th>
                        <th className="p-3">បរិមាណ</th>
                        <th className="p-3 rounded-r-lg">តម្លៃសរុប</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.slice(0, 5).map(s => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                          <td className="p-3 font-medium text-gray-800">
                            {s.productName}
                            {s.plateNumber && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-800 px-1 rounded">{s.plateNumber}</span>}
                          </td>
                          <td className="p-3 text-gray-500">{s.quantity}</td>
                          <td className="p-3 font-bold text-blue-600">${s.total.toFixed(2)}</td>
                        </tr>
                      ))}
                      {sales.length === 0 && (
                        <tr><td colSpan={3} className="p-3 text-center text-gray-400">មិនទាន់មានការលក់</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case ViewState.AI_ASSISTANT:
        return (
          <div className="space-y-6">
             <h1 className="text-2xl font-bold text-gray-800">ជំនួយការ AI (AI Assistant)</h1>
             <p className="text-gray-600">សួរព័ត៌មានអំពីស្តុកម៉ូតូ ឬសុំយោបល់ផ្សេងៗពី Gemini AI។</p>
             <AIAssistant products={products} />
          </div>
        );
      case ViewState.REPORTS:
        return <ReportsView sales={sales} expenses={expenses} />;
      case ViewState.EXPENSES:
        return (
          <ExpensesView 
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        );
      case ViewState.SALES:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800">បញ្ជីលក់ (Sales Record)</h1>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setEditingSale(undefined); setIsSalesFormOpen(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <ShoppingBag size={18} />
                  <span>លក់ចេញ</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-semibold">កាលបរិច្ឆេទ</th>
                      <th className="p-4 font-semibold">ឈ្មោះផលិតផល</th>
                      <th className="p-4 font-semibold">ផ្លាកលេខ</th>
                      <th className="p-4 font-semibold">តម្លៃលក់</th>
                      <th className="p-4 font-semibold text-center">បរិមាណ</th>
                      <th className="p-4 font-semibold text-right">សរុប</th>
                      <th className="p-4 font-semibold text-right print:hidden">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSales.length > 0 ? filteredSales.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4 text-sm text-gray-500">
                          {new Date(s.date).toLocaleString('km-KH')}
                        </td>
                        <td className="p-4 font-medium text-gray-900">{s.productName}</td>
                        <td className="p-4">
                          {s.plateNumber ? (
                            <span className="font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-sm">{s.plateNumber}</span>
                          ) : (
                            <span className="text-gray-300 text-xs italic">គ្មាន</span>
                          )}
                        </td>
                        <td className="p-4 text-gray-600">${s.salePrice.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {s.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-right font-bold text-emerald-600">
                          ${s.total.toFixed(2)}
                        </td>
                         <td className="p-4 text-right print:hidden">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditSaleClick(s)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="កែប្រែ"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSale(s.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="លុប"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={7} className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                          <History size={48} className="mb-4 opacity-50" />
                          <p>មិនទាន់មានទិន្នន័យលក់ទេ។</p>
                          <button 
                            onClick={() => setIsSalesFormOpen(true)}
                            className="mt-4 text-blue-600 hover:underline text-sm print:hidden"
                          >
                            ចុចទីនេះដើម្បីកត់ត្រាការលក់ដំបូង
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case ViewState.INVENTORY:
      default:
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-800">បញ្ជីម៉ូតូ (Inventory)</h1>
              <div className="flex flex-wrap gap-2 print:hidden items-center">
                
                {/* Out of Stock Toggle */}
                <button
                  onClick={() => setShowOutOfStock(!showOutOfStock)}
                  className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-sm transition-colors ${
                    showOutOfStock 
                      ? 'bg-orange-50 text-orange-700 border-orange-200' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                  title={showOutOfStock ? "លាក់ផលិតផលអស់ស្តុក" : "បង្ហាញផលិតផលអស់ស្តុក"}
                >
                  {showOutOfStock ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span className="hidden sm:inline">
                    {showOutOfStock ? 'លាក់របស់អស់' : 'បង្ហាញរបស់អស់'}
                  </span>
                </button>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text"
                    placeholder="ស្វែងរកម៉ូតូ, ផ្លាកលេខ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                  />
                </div>
                <button 
                  onClick={() => { setEditingProduct(undefined); setIsFormOpen(true); }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  <span className="hidden md:inline">បន្ថែមថ្មី</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700 text-sm uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-semibold">ម៉ូតូ / ឆ្នាំ</th>
                      <th className="p-4 font-semibold">ផ្លាកលេខ / ពណ៌</th>
                      <th className="p-4 font-semibold">តម្លៃ (Cost/Sell)</th>
                      <th className="p-4 font-semibold text-center">ស្តុក</th>
                      <th className="p-4 font-semibold">ថ្ងៃចូល</th>
                      <th className="p-4 font-semibold text-right print:hidden">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.length > 0 ? filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{p.name}</p>
                            <p className="text-xs text-gray-500 flex flex-wrap gap-2 items-center mt-1">
                              <span>{p.category}</span>
                              {p.year && <span className="text-gray-400">• {p.year}</span>}
                              {p.condition && (
                                <span className={`px-2 py-0.5 rounded text-[10px] border ${
                                  p.condition === 'ក្រដាសពន្ធថ្មី' ? 'bg-green-50 text-green-700 border-green-100' :
                                  p.condition === 'ក្រដាសពន្ធមួយទឹក' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                  'bg-orange-50 text-orange-700 border-orange-100'
                                }`}>
                                  {p.condition}
                                </span>
                              )}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col text-sm">
                              {p.plateNumber ? (
                                <span className="font-mono bg-yellow-100 px-2 py-0.5 rounded text-yellow-800 w-fit">{p.plateNumber}</span>
                              ) : (
                                <span className="text-gray-400 italic text-xs">គ្មានផ្លាកលេខ</span>
                              )}
                              {p.color && <span className="text-gray-500 text-xs mt-1">{p.color}</span>}
                           </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-sm">
                             <span className="text-emerald-600 font-medium">${p.price.toFixed(2)}</span>
                             <span className="text-gray-400 text-xs">${p.cost.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            p.quantity === 0 ? 'bg-gray-100 text-gray-500' :
                            p.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {p.quantity === 0 ? 'អស់ស្តុក' : p.quantity}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-gray-500">
                           {p.dateAdded ? new Date(p.dateAdded).toLocaleDateString('km-KH') : '-'}
                        </td>
                        <td className="p-4 text-right print:hidden">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          {searchTerm ? 'រកមិនឃើញផលិតផលតាមការស្វែងរក។' : 
                           showOutOfStock ? 'មិនមានផលិតផលទេ។' : 'មិនមានផលិតផលទេ (ឬផលិតផលអស់ស្តុកត្រូវបានលាក់)។'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar - Hide on Print */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20 shadow-md md:shadow-none fixed md:relative h-full print:hidden`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <PackageSearch size={24} />
          </div>
          {sidebarOpen && <span className="font-bold text-xl text-gray-800 tracking-tight">K-Motor Stock</span>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="ផ្ទាំងគ្រប់គ្រង" 
            active={viewState === ViewState.DASHBOARD}
            onClick={() => setViewState(ViewState.DASHBOARD)}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={PackageSearch} 
            label="បញ្ជីម៉ូតូ" 
            active={viewState === ViewState.INVENTORY}
            onClick={() => setViewState(ViewState.INVENTORY)}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={ShoppingBag} 
            label="បញ្ជីលក់" 
            active={viewState === ViewState.SALES}
            onClick={() => setViewState(ViewState.SALES)}
            expanded={sidebarOpen}
          />
           <SidebarItem 
            icon={Wallet} 
            label="ការចំណាយ" 
            active={viewState === ViewState.EXPENSES}
            onClick={() => setViewState(ViewState.EXPENSES)}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={BarChart3} 
            label="របាយការណ៍" 
            active={viewState === ViewState.REPORTS}
            onClick={() => setViewState(ViewState.REPORTS)}
            expanded={sidebarOpen}
          />
          <SidebarItem 
            icon={MessageSquareMore} 
            label="ជំនួយការ AI" 
            active={viewState === ViewState.AI_ASSISTANT}
            onClick={() => setViewState(ViewState.AI_ASSISTANT)}
            expanded={sidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
          </button>
        </div>
      </aside>

      {/* Main Content - Full width on Print */}
      <main className="flex-1 overflow-auto p-4 md:p-8 ml-20 md:ml-0 print:ml-0 print:p-0 print:overflow-visible">
        <div className="max-w-7xl mx-auto print:max-w-none">
          {/* Mobile Header Toggle - Hide on Print */}
          <div className="md:hidden mb-4 flex items-center justify-between print:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 bg-white rounded-md shadow-sm">
              <Menu size={20} />
            </button>
            <h1 className="font-bold text-gray-800">K-Motor Manager</h1>
          </div>

          {renderContent()}
        </div>
      </main>

      {isFormOpen && (
        <ProductForm 
          initialData={editingProduct} 
          onSubmit={handleAddProduct} 
          onCancel={() => { setIsFormOpen(false); setEditingProduct(undefined); }} 
        />
      )}

      {isSalesFormOpen && (
        <SalesForm 
          products={products}
          initialData={editingSale}
          onSubmit={handleSaveSale} 
          onCancel={() => { setIsSalesFormOpen(false); setEditingSale(undefined); }} 
        />
      )}
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick, expanded }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-blue-50 text-blue-600 font-medium' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} className={active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} />
    {expanded && <span>{label}</span>}
    {!expanded && active && <div className="absolute left-16 bg-blue-600 text-white text-xs px-2 py-1 rounded ml-2 shadow-lg z-50 whitespace-nowrap hidden group-hover:block">{label}</div>}
  </button>
);

export default App;