import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  MapPin, 
  Clock, 
  Check, 
  Sparkles, 
  Leaf, 
  TrendingDown,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { fetchShopperDeals } from '../api';

export default function ShopperDeals() {
  const [deals, setDeals] = useState([]);
  const [reservedDeals, setReservedDeals] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchShopperDeals();
        if (isMounted) setDeals(data);
      } catch (err) {
        console.error('Failed to fetch shopper deals:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleReserve = (dealId) => {
    setReservedDeals((prev) => ({
      ...prev,
      [dealId]: true,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Agent 8: Shopper Deals Agent
            </span>
            <h2 className="text-xl font-bold text-white">Zero-Waste Fresh Food Market</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Rescue near-expiry artisan groceries from your neighborhood supermarket at steep discounts. 
            Help eradicate retail food waste while saving your household grocery budget.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/40 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Average Savings</span>
            <p className="text-xl font-black text-emerald-400">15% - 35%</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-sky-500/40 text-center">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Freshness</span>
            <p className="text-xl font-black text-sky-400">100% Inspected</p>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deals.map((deal) => {
          const isReserved = reservedDeals[deal.deal_id];

          return (
            <div
              key={deal.deal_id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg transition-all relative flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {deal.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <Leaf className="w-3 h-3" /> {deal.eco_tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1">
                  {deal.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{deal.store_name} ({deal.store_locality})</span>
                </div>

                {/* Price Box */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">Discounted Price</span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        ₹{deal.deal_price.toFixed(0)}
                      </span>
                      <span className="text-xs text-slate-400 line-through font-mono">
                        ₹{deal.original_price.toFixed(0)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider">You Save</span>
                    <p className="text-sm font-bold text-emerald-300 font-mono">
                      ₹{deal.savings_amount.toFixed(0)} ({deal.discount_percentage}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 px-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    Best before: {deal.days_to_expiry} days
                  </span>
                  <span>{deal.units_available} units left</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleReserve(deal.deal_id)}
                disabled={isReserved}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isReserved
                    ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                }`}
              >
                {isReserved ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Reserved! Pickup Code: #RZV-901
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Reserve for 1-Hour Store Pickup
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
