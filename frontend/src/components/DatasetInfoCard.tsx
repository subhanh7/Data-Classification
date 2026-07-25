import React from 'react';
import { motion } from 'framer-motion';
import { Table, Hash, Tag, FileText, CheckCircle2, ListFilter } from 'lucide-react';
import { DatasetInfo } from '../types/pipeline';

interface DatasetInfoCardProps {
  info: DatasetInfo;
}

export const DatasetInfoCard: React.FC<DatasetInfoCardProps> = ({ info }) => {
  const items = [
    { label: 'Dataset Name', value: info.name, icon: FileText },
    { label: 'Total Samples', value: `${info.samples} instances`, icon: Hash },
    { label: 'Features Count', value: `${info.features_count} numeric features`, icon: Table },
    { label: 'Target Column', value: info.target_column, icon: Tag },
    { label: 'Classes Count', value: `${info.classes_count} target species`, icon: ListFilter },
    { label: 'Data Source', value: info.source, icon: CheckCircle2 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Dataset Information
          </h3>
          <p className="text-xs text-[#6B7280]">
            Input Attributes & Class Distribution
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
          Validated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]/60">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
                <Icon className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.label}</span>
              </div>
              <span className="text-xs font-semibold text-[#111827] font-mono">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Feature Names & Class Pills */}
      <div className="pt-3 border-t border-[#E5E7EB]/60 flex flex-wrap gap-2">
        <span className="text-[11px] font-medium text-[#6B7280] self-center mr-1">Classes:</span>
        {info.class_names.map((c) => (
          <span
            key={c}
            className="px-2.5 py-0.5 text-[11px] font-mono font-medium text-gray-700 bg-gray-100 rounded-md border border-gray-200"
          >
            {c}
          </span>
        ))}
      </div>
    </motion.div>
  );
};
