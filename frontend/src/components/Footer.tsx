import React from 'react';
import { Cpu, ShieldCheck, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-[#E5E7EB] bg-white py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-[#111827] flex items-center justify-center text-white">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <span className="font-semibold text-[#111827]">
            AI Data Classification Platform
          </span>
          <span>&bull;</span>
          <span>KNN Engine v1.0.0</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Single-Responsibility Architecture</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Python 3.12 + FastAPI + React TS</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
