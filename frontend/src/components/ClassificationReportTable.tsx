import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import { ClassificationReportRow } from '../types/pipeline';

interface ClassificationReportTableProps {
  report: ClassificationReportRow[];
  onDownloadTXT: () => void;
}

export const ClassificationReportTable: React.FC<ClassificationReportTableProps> = ({
  report,
  onDownloadTXT,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-semibold text-[#111827]">
              Classification Report
            </h3>
          </div>
          <p className="text-xs text-[#6B7280]">
            Per-class precision, recall, F1 score, and support count breakdown
          </p>
        </div>

        <button
          onClick={onDownloadTXT}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#6B7280]" />
          <span>Export TXT</span>
        </button>
      </div>

      {/* Styled Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider bg-[#F8F9FB]">
              <th className="py-3 px-4 rounded-l-xl">Target Class</th>
              <th className="py-3 px-4">Precision</th>
              <th className="py-3 px-4">Recall</th>
              <th className="py-3 px-4">F1 Score</th>
              <th className="py-3 px-4">Support</th>
              <th className="py-3 px-4 rounded-r-xl">Performance Indicator</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB]/60 text-xs">
            {report.map((row) => {
              const precisionPct = Math.round(row.precision * 100);
              const recallPct = Math.round(row.recall * 100);
              const f1Pct = Math.round(row.f1_score * 100);

              return (
                <tr key={row.class_name} className="hover:bg-[#F8F9FB]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#111827] font-mono">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                      {row.class_name}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-[#111827] tabular-nums">
                    {row.precision.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-[#111827] tabular-nums">
                    {row.recall.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-blue-600 font-bold tabular-nums">
                    {row.f1_score.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#6B7280] tabular-nums">
                    {row.support} samples
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${f1Pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[#6B7280]">
                        {f1Pct}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
