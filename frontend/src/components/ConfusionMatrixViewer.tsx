import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Image as ImageIcon, Maximize2, X } from 'lucide-react';
import { ConfusionMatrixData } from '../types/pipeline';

interface ConfusionMatrixViewerProps {
  matrixData: ConfusionMatrixData;
  onDownloadPNG: () => void;
}

export const ConfusionMatrixViewer: React.FC<ConfusionMatrixViewerProps> = ({
  matrixData,
  onDownloadPNG,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E7EB]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#111827]">
                Confusion Matrix Heatmap
              </h3>
              <span className="px-2 py-0.5 text-[11px] font-medium text-blue-700 bg-blue-50 border border-blue-100 rounded-md">
                Hero Metric
              </span>
            </div>
            <p className="text-xs text-[#6B7280]">
              Visual breakdown of true vs predicted classification counts
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#6B7280]" />
              <span>Expand</span>
            </button>

            <button
              onClick={onDownloadPNG}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-subtle"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>

        {/* Centered Plot Container */}
        <div className="relative min-h-[300px] flex items-center justify-center p-4 bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]/80 overflow-hidden group">
          {matrixData.image_b64 || matrixData.image_url ? (
            <img
              src={matrixData.image_b64 || matrixData.image_url}
              alt="Confusion Matrix Heatmap"
              className="max-h-[320px] w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-[#6B7280] py-12">
              <ImageIcon className="w-10 h-10 mb-2 stroke-1 opacity-50" />
              <span className="text-xs font-medium">Confusion matrix plot loading...</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Expanded Modal Preview */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full border border-[#E5E7EB] shadow-modal relative animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  Confusion Matrix Heatmap
                </h3>
                <p className="text-xs text-[#6B7280]">Full resolution plot viewer</p>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center bg-[#F8F9FB] rounded-2xl p-6 border border-[#E5E7EB]">
              <img
                src={matrixData.image_b64 || matrixData.image_url}
                alt="Confusion Matrix Expanded"
                className="max-h-[500px] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#111827] bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]"
              >
                Close
              </button>
              <button
                onClick={onDownloadPNG}
                className="px-4 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Save High-Res PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
