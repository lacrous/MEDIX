import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/layout/Header';
import Pagination from '@/components/ui/DataPagination';
import { getInventoryItems, getLowStockItems, getExpiringItems } from '@/services/dataService';
import { Package, AlertTriangle, Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Inventory() {
  const { user, isSuperAdmin } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [expiring, setExpiring] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 10;

  const hospitalId = isSuperAdmin ? undefined : user?.hospitalId;

  const load = useCallback(async () => {
    setIsLoading(true);
    const [all, low, exp] = await Promise.all([
      getInventoryItems(hospitalId), getLowStockItems(hospitalId), getExpiringItems(hospitalId),
    ]);
    setItems(all); setFiltered(all); setLowStock(low); setExpiring(exp); setIsLoading(false);
  }, [hospitalId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    let res = items.filter((i: any) => {
      const matchesSearch = !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.code.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'low') return matchesSearch && i.quantity <= i.minStock;
      if (activeTab === 'expiring') return matchesSearch && i.expiryDate && new Date(i.expiryDate) <= new Date(Date.now() + 90 * 86400000);
      return matchesSearch;
    });
    setFiltered(res); setPage(1);
  }, [searchQuery, activeTab, items]);

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#f8fafc]">
      <Header title={t('inventory')} subtitle={t('manageInventory')} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm"><Package className="w-5 h-5 text-[#0f256e] mb-2" /><p className="text-xl font-bold text-gray-900">{items.length}</p><p className="text-[11px] text-gray-400">{t('totalItems')}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm"><p className="text-xl font-bold text-gray-900">${totalValue.toLocaleString()}</p><p className="text-[11px] text-gray-400">{t('totalValue')}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-r-2 border-amber-400"><AlertTriangle className="w-5 h-5 text-amber-500 mb-2" /><p className="text-xl font-bold text-amber-600">{lowStock.length}</p><p className="text-[11px] text-gray-400">{t('lowStockAlert')}</p></div>
            <div className="bg-white rounded-xl p-4 shadow-sm border-r-2 border-red-400"><Clock className="w-5 h-5 text-red-500 mb-2" /><p className="text-xl font-bold text-red-600">{expiring.length}</p><p className="text-[11px] text-gray-400">{t('expiringItems')}</p></div>
          </div>

          {/* Tabs & Search */}
          <div className="bg-white rounded-xl shadow-sm mb-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex gap-1">
                {[{ key: 'all', label: t('all'), count: items.length }, { key: 'low', label: t('lowStock'), count: lowStock.length }, { key: 'expiring', label: t('expiringSoon'), count: expiring.length }].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", activeTab === tab.key ? "bg-[#0f256e] text-white" : "text-gray-600 hover:bg-gray-50")}>{tab.label} ({tab.count})</button>
                ))}
              </div>
              <div className="relative"><Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder={t('search')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 pr-10 pl-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f256e]/20 text-right" /></div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>{[t('itemCode'), t('itemName'), t('category'), t('stockQuantity'), t('minStock'), t('unitPrice'), t('expiryDate'), t('status')].map((h, i) => <th key={i} className="px-4 py-3 text-right font-medium text-gray-500 text-xs">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? Array.from({ length: 5 }).map((_, i) => <tr key={i} className="animate-pulse">{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-3 bg-gray-100 rounded w-3/4" /></td>)}</tr>) : paginated.map(item => {
                    const isLow = item.quantity <= item.minStock;
                    const isExpiring = item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 90 * 86400000);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-[11px] font-mono text-gray-400">{item.code}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{t(item.category.toLowerCase() as any)}</td>
                        <td className="px-4 py-3"><span className={cn("text-sm font-bold", isLow ? "text-red-600" : "text-gray-900")}>{item.quantity}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{item.minStock}</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-600">${item.unitPrice}</td>
                        <td className="px-4 py-3">{item.expiryDate && <span className={cn("text-xs", isExpiring ? "text-red-600 font-medium" : "text-gray-500")}>{new Date(item.expiryDate).toLocaleDateString()}</span>}</td>
                        <td className="px-4 py-3">{isLow && <span className="px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-medium">{t('lowStock')}</span>}{isExpiring && <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-medium mr-1">{t('expiringSoon')}</span>}{!isLow && !isExpiring && <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-600 text-[10px] font-medium">{t('active')}</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {!isLoading && filtered.length === 0 && <div className="text-center py-12"><Package className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-400 text-sm">{t('noData')}</p></div>}
            {filtered.length > 0 && <Pagination currentPage={page} totalItems={filtered.length} itemsPerPage={ITEMS_PER_PAGE} onPageChange={setPage} />}
          </div>
        </div>
      </main>
    </div>
  );
}
