import React from 'react';
import { Download, Play, Upload, Sparkles } from 'lucide-react';

interface ProjectHeaderProps {
  onRunPipeline: () => void;
  onOpenUpload: () => void;
  onExport: (type: 'json' | 'report' | 'matrix') => void;
  isExecuting: boolean;
  showExport?: boolean;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  onRunPipeline,
  onOpenUpload,
  onExport,
  isExecuting,
  showExport = false,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E5E7EB]">
      {/* Title & Description */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#111827]">
            AI Data Classification
          </h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Sparkles className="w-3 h-3" /> Production ML
          </span>
        </div>
        <p className="text-sm text-[#6B7280]">
          Supervised Machine Learning pipeline using K-Nearest Neighbors (KNN) algorithm with feature scaling and cross-validation evaluation.
        </p>
      </div>

      {/* Action Buttons (Only Export if completed) */}
      {showExport && (
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative group">
            <button
              disabled={isExecuting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-[#111827] bg-white border border-[#E5E7EB] hover:bg-gray-50 hover:border-gray-300 transition-all shadow-subtle disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-[#6B7280]" />
              <span>Export Results</span>
            </button>

            {/* Export Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-modal opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 p-1.5">
              <button
                onClick={() => onExport('json')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8F9FB] rounded-lg flex items-center justify-between"
              >
                <span>Metrics (JSON)</span>
                <span className="text-[10px] text-[#6B7280] font-mono">.json</span>
              </button>
              <button
                onClick={() => onExport('report')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8F9FB] rounded-lg flex items-center justify-between"
              >
                <span>Classification Report</span>
                <span className="text-[10px] text-[#6B7280] font-mono">.txt</span>
              </button>
              <button
                onClick={() => onExport('matrix')}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#111827] hover:bg-[#F8F9FB] rounded-lg flex items-center justify-between"
              >
                <span>Confusion Matrix Image</span>
                <span className="text-[10px] text-[#6B7280] font-mono">.png</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
