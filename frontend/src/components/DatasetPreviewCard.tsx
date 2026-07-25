import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Hash, Table, Tag, ListFilter, Play, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { DatasetPreview } from '../types/pipeline';

interface DatasetPreviewCardProps {
  preview: DatasetPreview;
  onRunClassification: () => void;
  isExecuting: boolean;
  onReset: () => void;
}

export const DatasetPreviewCard: React.FC<DatasetPreviewCardProps> = ({
  preview,
  onRunClassification,
  isExecuting,
  onReset,
}) => {
  const items = [
    { label: 'Dataset File', value: preview.filename, icon: FileText, highlight: true },
    { label: 'Format Type', value: preview.format.toUpperCase(), icon: Tag },
    { label: 'Total Instances', value: `${preview.rows} rows`, icon: Hash },
    { label: 'Features Count', value: `${preview.features_count} numeric features`, icon: Table },
    { label: 'Target Column', value: preview.target_column, icon: Tag },
    { label: 'Target Classes', value: `${preview.classes_count} species classes`, icon: ListFilter },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-5 border-b border-[#E5E7EB] gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h3 className="text-lg font-semibold text-[#111827]">
              Step 2: Dataset Validation & Preview
            </h3>
            <span className="px-2.5 py-0.5 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
              {preview.validation_status}
            </span>
          </div>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Dataset loaded and validated successfully. Ready for ML pipeline execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            disabled={isExecuting}
            className="px-3.5 py-2 rounded-xl text-xs font-medium text-[#6B7280] hover:text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] transition-colors"
          >
            Change Dataset
          </button>

          <button
            onClick={onRunClassification}
            disabled={isExecuting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#2563EB] hover:bg-blue-700 transition-all shadow-subtle disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isExecuting ? 'Processing Pipeline...' : 'Run Classification'}</span>
          </button>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3.5 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]/70">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.label}</span>
              </div>
              <span className={`text-xs font-semibold font-mono ${item.highlight ? 'text-blue-600' : 'text-[#111827]'}`}>
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Source & Class Pill Bar */}
      <div className="pt-3 border-t border-[#E5E7EB]/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#6B7280]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Source: <strong className="text-[#111827] font-medium">{preview.source}</strong></span>
          <span>&bull;</span>
          <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Loaded at {preview.upload_time}</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-[#6B7280]">Target Classes:</span>
          {preview.class_names.map((c) => (
            <span
              key={c}
              className="px-2.5 py-0.5 text-[11px] font-mono font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
