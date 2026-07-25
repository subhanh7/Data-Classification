import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Database, Layers, ShieldCheck, Binary, FileCode } from 'lucide-react';
import { ModelInfo } from '../types/pipeline';

interface ModelInfoCardProps {
  info: ModelInfo;
}

export const ModelInfoCard: React.FC<ModelInfoCardProps> = ({ info }) => {
  const items = [
    { label: 'Algorithm', value: info.algorithm, icon: Binary },
    { label: 'Hyperparameters', value: `K = ${info.n_neighbors} Neighbors`, icon: Sliders },
    { label: 'Training Samples', value: `${info.training_samples} rows (80%)`, icon: Database },
    { label: 'Testing Samples', value: `${info.testing_samples} rows (20%)`, icon: Layers },
    { label: 'Feature Scaler', value: info.scaler, icon: ShieldCheck },
    { label: 'Model Artifact', value: 'models/classifier.pkl', icon: FileCode },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
        <div>
          <h3 className="text-base font-semibold text-[#111827]">
            Model Information
          </h3>
          <p className="text-xs text-[#6B7280]">
            Architecture & Training Hyperparameters
          </p>
        </div>
        <span className="px-2.5 py-1 text-[11px] font-mono font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-lg">
          Seed: {info.random_seed}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="p-3 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]/60">
              <div className="flex items-center gap-2 text-xs text-[#6B7280] mb-1">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
                <span>{item.label}</span>
              </div>
              <span className="text-xs font-semibold text-[#111827] font-mono">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
