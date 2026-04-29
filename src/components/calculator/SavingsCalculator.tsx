'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Zap, 
  Clock, 
  Wind, 
  Leaf, 
  ChevronRight, 
  Share2, 
  Info,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function SavingsCalculator() {
  const [numFans, setNumFans] = useState(3);
  const [hoursPerDay, setHoursPerDay] = useState(12);
  const [elecRate, setElecRate] = useState(45);
  const [traditionalWatts, setTraditionalWatts] = useState(75);
  const [tamoorWatts, setTamoorWatts] = useState(30);

  const stats = useMemo(() => {
    const daysPerYear = 365;
    
    // Traditional
    const traditionalKwhPerYear = (traditionalWatts * hoursPerDay * daysPerYear) / 1000;
    const traditionalCostPerYear = traditionalKwhPerYear * elecRate;
    
    // Tamoor
    const tamoorKwhPerYear = (tamoorWatts * hoursPerDay * daysPerYear) / 1000;
    const tamoorCostPerYear = tamoorKwhPerYear * elecRate;
    
    const annualSavingsPerFan = traditionalCostPerYear - tamoorCostPerYear;
    const totalAnnualSavings = annualSavingsPerFan * numFans;
    const monthlySavings = totalAnnualSavings / 12;
    const dailySavings = totalAnnualSavings / 365;
    
    // CO2 savings (0.5kg per kWh)
    const co2SavedPerYear = (traditionalKwhPerYear - tamoorKwhPerYear) * 0.5 * numFans;
    
    // Payback period (assuming fan costs 8500 PKR average)
    const avgFanPrice = 8500;
    const paybackMonths = (avgFanPrice * numFans) / monthlySavings;

    return {
      totalAnnualSavings,
      monthlySavings,
      dailySavings,
      co2SavedPerYear,
      paybackMonths,
      percentageSaved: ((traditionalWatts - tamoorWatts) / traditionalWatts) * 100
    };
  }, [numFans, hoursPerDay, elecRate, traditionalWatts, tamoorWatts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-6">
          {/* Number of Fans */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Wind size={18} className="text-blue-500" />
                Number of Fans
              </label>
              <span className="text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-xl">
                {numFans}
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={numFans}
              onChange={(e) => setNumFans(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex flex-wrap gap-2 pt-2">
              {Array.from({ length: Math.min(numFans, 10) }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-400 flex items-center justify-center"
                >
                  <Wind size={14} className="animate-spin-slow" />
                </motion.div>
              ))}
              {numFans > 10 && <span className="text-slate-300 self-center text-xs font-bold">+{numFans - 10} more</span>}
            </div>
          </div>

          {/* Hours Per Day */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                Daily Usage (Hours)
              </label>
              <span className="text-xl font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-xl">
                {hoursPerDay}h
              </span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="24" 
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Electricity Rate */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Zap size={18} className="text-indigo-500" />
                Electricity Rate (PKR/Unit)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">PKR</span>
                <input 
                  type="number" 
                  value={elecRate}
                  onChange={(e) => setElecRate(parseInt(e.target.value) || 0)}
                  className="w-24 pl-10 pr-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-black focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              * Average rate in Pakistan varies from 35 to 65 PKR depending on consumption slab.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={() => {
              setNumFans(3);
              setHoursPerDay(12);
              setElecRate(45);
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RotateCcw size={14} />
            Reset to defaults
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="lg:col-span-7 space-y-6">
        {/* Main Savings Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-1 rounded-[2.5rem] shadow-2xl shadow-blue-500/30">
          <div className="bg-white/5 backdrop-blur-sm rounded-[2.3rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-blue-100 text-sm font-bold uppercase tracking-widest mb-2">Estimated Annual Savings</p>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-2xl font-bold opacity-80">PKR</span>
                <h2 className="text-6xl font-black tracking-tight leading-none">
                  {Math.round(stats.totalAnnualSavings).toLocaleString()}
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Monthly</p>
                  <p className="text-xl font-black">PKR {Math.round(stats.monthlySavings).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">Daily</p>
                  <p className="text-xl font-black">PKR {Math.round(stats.dailySavings).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-200 uppercase mb-1">CO₂ Saved</p>
                  <p className="text-xl font-black flex items-center gap-1">
                    {stats.co2SavedPerYear.toFixed(1)} <span className="text-sm font-bold opacity-60">kg</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl flex gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <Leaf size={28} />
            </div>
            <div>
              <h4 className="text-emerald-900 font-bold mb-1">Environmental Impact</h4>
              <p className="text-emerald-700/70 text-sm leading-relaxed">
                By switching to Tamoor Fans, you're planting the equivalent of <b>{Math.round(stats.co2SavedPerYear / 20)}</b> trees every year.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl flex gap-5">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
              <Clock size={28} />
            </div>
            <div>
              <h4 className="text-amber-900 font-bold mb-1">Payback Period</h4>
              <p className="text-amber-700/70 text-sm leading-relaxed">
                These fans will pay for themselves in just <b>{Math.round(stats.paybackMonths)}</b> months through energy savings.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black mb-1 !text-white tracking-tight">Ready to start saving?</h3>
            <p className="text-white/40 text-sm font-medium">Browse our most energy-efficient DC models.</p>
          </div>
          <Link 
            href="/products?type=dc"
            className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 hover:scale-110 transition-transform active:scale-95"
          >
            <ChevronRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}
