import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, PieChart, Layers } from 'lucide-react';
import { ConfusionMatrixData } from '../types/pipeline';

interface MatrixSummaryCardProps {
  summary: ConfusionMatrixData;
}

export const MatrixSummaryCard: React.FC<MatrixSummaryCardProps> = ({ summary }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
    >
      <div>
        <div className="pb-4 mb-4 border-b border-[#E5E7EB]">
          <h3 className="text-base font-semibold text-[#111827]">
            Prediction Summary
          </h3>
          <p className="text-xs text-[#6B7280]">
            Held-out Test Set Performance Audit
          </p>
        </div>

        {/* Big Stat Pill */}
        <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB] mb-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-[#6B7280]">Accuracy Rate</span>
            <span className="text-xs font-mono font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              {summary.accuracy_percent}%
            </span>
          </div>
          {/* Visual Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${summary.accuracy_percent}%` }}
            />
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E7EB]/80">
            <div className="flex items-center gap-2.5 text-xs text-[#111827]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-medium">Correct Predictions</span>
            </div>
            <span className="text-sm font-bold font-mono text-emerald-600">
              {summary.correct_predictions}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E7EB]/80">
            <div className="flex items-center gap-2.5 text-xs text-[#111827]">
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-medium">Incorrect Predictions</span>
            </div>
            <span className="text-sm font-bold font-mono text-red-600">
              {summary.incorrect_predictions}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#E5E7EB]/80">
            <div className="flex items-center gap-2.5 text-xs text-[#111827]">
              <Layers className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">Total Test Samples</span>
            </div>
            <span className="text-sm font-bold font-mono text-[#111827]">
              {summary.total_test_samples}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-[#E5E7EB]/80">
        <p className="text-[12px] text-[#6B7280] leading-relaxed">
          The test set contains {summary.total_test_samples} instances. {summary.correct_predictions} instances were classified correctly with zero data leakage.
        </p>
      </div>
    </motion.div>
  );
};
