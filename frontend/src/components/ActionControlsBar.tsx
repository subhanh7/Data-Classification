import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Download, FileText, Image as ImageIcon, RotateCcw, Sliders } from 'lucide-react';

interface ActionControlsBarProps {
  onOpenUpload: () => void;
  onRunPipeline: () => void;
  onExportJSON: () => void;
  onExportReport: () => void;
  onExportMatrix: () => void;
  onReset: () => void;
  isExecuting: boolean;
}

export const ActionControlsBar: React.FC<ActionControlsBarProps> = ({
  onOpenUpload,
  onRunPipeline,
  onExportJSON,
  onExportReport,
  onExportMatrix,
  onReset,
  isExecuting,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-[#111827]">
            Pipeline Operations & Control
          </h3>
          <p className="text-xs text-[#6B7280]">
            Trigger retraining, upload dataset CSV, download artifacts, or reset state
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenUpload}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Upload Dataset</span>
          </button>

          <button
            onClick={onRunPipeline}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-subtle disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isExecuting ? 'Training...' : 'Run Classification'}</span>
          </button>

          <button
            onClick={onExportJSON}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={onExportMatrix}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Download PNG</span>
          </button>

          <button
            onClick={onExportReport}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={onReset}
            disabled={isExecuting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
