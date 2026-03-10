import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { Search, Plus, Filter, MoreVertical, Package, AlertTriangle } from 'lucide-react';

// Mock Data
const fetchInventory = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', name: 'Unga wa Dola 2kg', price: 220, cost: 180, stock: 50, minStock: 20, category: 'Groceries' },
    { id: '2', name: 'Supa Loaf 400g', price: 65, cost: 50, stock: 20, minStock: 15, category: 'Bakery' },
    { id: '3', name: 'Menengai Soap 1kg', price: 180, cost: 140, stock: 5, minStock: 10, category: 'Household' },
    { id: '4', name: 'KCC Milk 500ml', price: 60, cost: 45, stock: 40, minStock: 20, category: 'Dairy' },
    { id: '5', name: 'Sugar 1kg', price: 150, cost: 120, stock: 100, minStock: 50, category: 'Groceries' },
    { id: '6', name: 'Cooking Oil 1L', price: 350, cost: 280, stock: 8, minStock: 15, category: 'Groceries' },
    { id: '7', name: 'Salt 500g', price: 30, cost: 20, stock: 80, minStock: 30, category: 'Groceries' },
    { id: '8', name: 'Tea Leaves 250g', price: 120, cost: 90, stock: 45, minStock: 20, category: 'Groceries' },
  ];
};

export default function Inventory() {
  const [search, setSearch] = useState('');
  const { data: products, isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const lowStockCount = products?.filter(p => p.stock <= p.minStock).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Manage your products and stock levels</p>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-medium flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" /> Add Product
        </button>
      </div>

      {lowStockCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-amber-800">Low Stock Alert</h3>
            <p className="text-sm text-amber-700 mt-1">
              You have {lowStockCount} products running low on stock. Please restock soon to avoid missing sales.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Buying Price</th>
                <th className="px-6 py-4 text-right">Selling Price</th>
                <th className="px-6 py-4 text-right">Stock Level</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mr-3">
                        <Package className="w-4 h-4 text-gray-500" />
                      </div>
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 text-right text-gray-500">{formatCurrency(product.cost)}</td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-medium ${product.stock <= product.minStock ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {product.stock <= product.minStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Low Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found matching "{search}"
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
