import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Dashboard from '@/pages/Dashboard';
import POS from '@/pages/POS';
import Inventory from '@/pages/Inventory';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<div className="p-4">Customers & Debt (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-4">Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}
