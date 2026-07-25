import React from 'react';
import { Cpu, RefreshCw, Github, ExternalLink, RotateCcw } from 'lucide-react';
import { WorkflowStep } from '../types/pipeline';

interface NavbarProps {
  workflowStep: WorkflowStep;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ workflowStep, onReset }) => {
  const getStatusBadge = () => {
    switch (workflowStep) {
      case 'IDLE':
        return {
          label: 'Pipeline Idle',
          dotBg: 'bg-gray-400',
          badgeBg: 'bg-gray-100 border-gray-200 text-gray-700',
        };
      case 'PREVIEW':
        return {
          label: 'Dataset Loaded',
          dotBg: 'bg-blue-500',
          badgeBg: 'bg-blue-50 border-blue-200 text-blue-800',
        };
      case 'TRAINING':
        return {
          label: 'Executing Pipeline...',
          dotBg: 'bg-amber-500 animate-ping',
          badgeBg: 'bg-amber-50 border-amber-200 text-amber-800',
        };
      case 'COMPLETED':
        return {
          label: 'Model Trained & Verified',
          dotBg: 'bg-emerald-500',
          badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        };
    }
  };

  const status = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#111827] to-[#374151] flex items-center justify-center text-white shadow-subtle">
            <Cpu className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#111827]">
                AI Data Classification
              </span>
              <span className="px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                Supervised ML
              </span>
            </div>
            <p className="text-[12px] text-[#6B7280]">
              Iris Classification Engine &bull; KNN Pipeline
            </p>
          </div>
        </div>

        {/* Right Status & Actions */}
        <div className="flex items-center gap-4">
          {/* Dynamic Status Indicator */}
          <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${status.badgeBg}`}>
            <span className={`w-2 h-2 rounded-full ${status.dotBg}`}></span>
            <span>{status.label}</span>
          </div>

          {workflowStep !== 'IDLE' && (
            <button
              onClick={onReset}
              title="Reset Workflow State"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F8F9FB] transition-colors border border-[#E5E7EB]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors border border-[#E5E7EB] hover:border-gray-300 rounded-xl bg-white"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Repository</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </header>
  );
};
