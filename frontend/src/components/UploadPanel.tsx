import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Database, FileSpreadsheet, Sparkles, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface UploadPanelProps {
  onUploadFile: (file: File) => Promise<void>;
  onSelectBuiltin: () => Promise<void>;
  isProcessing: boolean;
}

export const UploadPanel: React.FC<UploadPanelProps> = ({
  onUploadFile,
  onSelectBuiltin,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.toLowerCase();
      if (!ext.endsWith('.csv') && !ext.endsWith('.data') && !ext.endsWith('.txt')) {
        setErrorMessage('Only .csv and .data dataset files are supported.');
        return;
      }
      setErrorMessage(null);
      try {
        await onUploadFile(file);
      } catch (err: any) {
        setErrorMessage(err.message || 'Dataset processing failed.');
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.toLowerCase();
      if (!ext.endsWith('.csv') && !ext.endsWith('.data') && !ext.endsWith('.txt')) {
        setErrorMessage('Only .csv and .data dataset files are supported.');
        return;
      }
      setErrorMessage(null);
      try {
        await onUploadFile(file);
      } catch (err: any) {
        setErrorMessage(err.message || 'Dataset processing failed.');
      }
    }
  };

  const handleBuiltinClick = async () => {
    setErrorMessage(null);
    try {
      await onSelectBuiltin();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load built-in dataset.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-3xl p-8 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-3 text-blue-600">
            <Upload className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-[#111827] tracking-tight">
            Step 1: Choose ML Dataset
          </h2>
          <p className="text-xs text-[#6B7280] mt-1">
            Upload a custom dataset in <code className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">.csv</code> or original UCI <code className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">.data</code> format, or select the built-in Iris dataset.
          </p>
        </div>

        {/* Drag and Drop Container */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E5E7EB] hover:border-blue-500 bg-[#F8F9FB] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.data,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <div className="p-3 bg-white rounded-xl border border-[#E5E7EB] group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-[#111827]">
              Click or drag dataset file here (.csv or .data)
            </span>
            <span className="text-xs text-[#6B7280]">
              Supports standard CSV or raw UCI <code className="font-mono text-blue-600">.data</code> files without headers (headers assigned automatically)
            </span>
          </div>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E5E7EB]"></div>
          </div>
          <span className="relative bg-white px-4 text-xs font-medium text-[#6B7280] uppercase tracking-wider">
            OR
          </span>
        </div>

        {/* Built-in Dataset Action */}
        <div>
          <button
            onClick={handleBuiltinClick}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-[#111827] bg-[#F8F9FB] border border-[#E5E7EB] hover:bg-gray-100 transition-colors shadow-subtle disabled:opacity-50"
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>Use Built-in Iris Dataset (150 samples)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
