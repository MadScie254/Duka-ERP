import { useState, useEffect } from 'react';
import { usePosStore, Product } from '@/store/posStore';
import { formatCurrency, generateReceiptNumber, normalizeKenyanPhone } from '@/lib/utils';
import { Search, ShoppingCart, Plus, Minus, Trash2, Smartphone, Banknote, FileText, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { PaymentMethod } from '@/lib/constants';

// Mock Products
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Unga wa Dola 2kg', price: 220, stock: 50, category: 'Groceries' },
  { id: '2', name: 'Supa Loaf 400g', price: 65, stock: 20, category: 'Bakery' },
  { id: '3', name: 'Menengai Soap 1kg', price: 180, stock: 15, category: 'Household' },
  { id: '4', name: 'KCC Milk 500ml', price: 60, stock: 40, category: 'Dairy' },
  { id: '5', name: 'Sugar 1kg', price: 150, stock: 100, category: 'Groceries' },
  { id: '6', name: 'Cooking Oil 1L', price: 350, stock: 30, category: 'Groceries' },
  { id: '7', name: 'Salt 500g', price: 30, stock: 80, category: 'Groceries' },
  { id: '8', name: 'Tea Leaves 250g', price: 120, stock: 45, category: 'Groceries' },
];

export default function POS() {
  const [search, setSearch] = useState('');
  const { cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal } = usePosStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [isProcessing, setIsProcessing] = useState(false);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
      if (e.key === 'F9') {
        e.preventDefault();
        handleCheckout();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, paymentMethod, phone]);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const receiptNo = generateReceiptNumber();
      const total = cartTotal();

      if (paymentMethod === PaymentMethod.MPESA) {
        if (!phone) throw new Error('Phone number required for M-PESA');
        const normalizedPhone = normalizeKenyanPhone(phone);
        
        // Simulate STK Push
        toast.loading(`Sending STK push to ${normalizedPhone}...`, { id: 'stk' });
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('M-PESA payment received!', { id: 'stk' });
      } else if (paymentMethod === PaymentMethod.CREDIT) {
        if (!customerName || !phone) throw new Error('Customer name and phone required for Mkopo');
        toast.success(`Credit recorded for ${customerName}`);
      } else {
        toast.success('Cash payment recorded');
      }

      // Generate WhatsApp Receipt Link
      const receiptText = `*DukaERP Receipt*\nReceipt No: ${receiptNo}\nDate: ${new Date().toLocaleString('en-KE')}\n\nItems:\n${cart.map(item => `${item.name} x${item.quantity} @ ${item.price} = ${item.price * item.quantity}`).join('\n')}\n\n*Total: ${formatCurrency(total)}*\nPayment: ${paymentMethod}\n\nThank you for shopping with us!`;
      
      const encodedText = encodeURIComponent(receiptText);
      const waLink = `https://wa.me/${phone ? normalizeKenyanPhone(phone) : ''}?text=${encodedText}`;

      toast((t) => (
        <div className="flex flex-col gap-2">
          <span className="font-bold">Sale Complete!</span>
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-green-500 text-white px-3 py-2 rounded-md text-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            <Send className="w-4 h-4 mr-2" /> Send WhatsApp Receipt
          </a>
        </div>
      ), { duration: 5000 });

      clearCart();
      setPhone('');
      setCustomerName('');
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-6">
      {/* Left: Product Grid */}
      <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="search-input"
              type="text"
              placeholder="Search products... (Press F2)"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`p-4 rounded-xl border text-left transition-all ${
                  product.stock === 0 
                    ? 'opacity-50 bg-gray-50 cursor-not-allowed border-gray-200' 
                    : 'bg-white border-gray-200 hover:border-emerald-500 hover:shadow-md active:scale-95'
                }`}
              >
                <div className="text-xs font-medium text-emerald-600 mb-1">{product.category}</div>
                <div className="font-semibold text-gray-900 line-clamp-2 h-10">{product.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-gray-900">KSh {product.price}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                    {product.stock} left
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Cart & Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex-shrink-0">
        <div className="p-4 border-b border-gray-100 bg-emerald-50 flex items-center justify-between">
          <h2 className="font-bold text-lg text-emerald-800 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" /> Current Sale
          </h2>
          <span className="bg-emerald-200 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full">
            {cart.length} items
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-medium text-sm text-gray-900 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500">KSh {item.price} x {item.quantity}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 hover:bg-red-100 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(cartTotal())}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              onClick={() => setPaymentMethod(PaymentMethod.CASH)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                paymentMethod === PaymentMethod.CASH ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              <Banknote className="w-5 h-5 mb-1" /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod(PaymentMethod.MPESA)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                paymentMethod === PaymentMethod.MPESA ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              <Smartphone className="w-5 h-5 mb-1" /> M-PESA
            </button>
            <button
              onClick={() => setPaymentMethod(PaymentMethod.CREDIT)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center text-xs font-medium transition-colors ${
                paymentMethod === PaymentMethod.CREDIT ? 'bg-amber-100 border-amber-500 text-amber-700' : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              <FileText className="w-5 h-5 mb-1" /> Mkopo
            </button>
          </div>

          {(paymentMethod === PaymentMethod.MPESA || paymentMethod === PaymentMethod.CREDIT) && (
            <div className="mb-4 space-y-2">
              <input
                type="tel"
                placeholder="Phone Number (e.g. 0712...)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              {paymentMethod === PaymentMethod.CREDIT && (
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              )}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
          >
            {isProcessing ? 'Processing...' : `Charge ${formatCurrency(cartTotal())} (F9)`}
          </button>
        </div>
      </div>
    </div>
  );
}
