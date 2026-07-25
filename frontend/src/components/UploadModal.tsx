import React, { useState, useRef } from 'react';
import { Upload, X, FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.endsWith('.csv')) {
        setErrorMessage('Only CSV files are supported.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv')) {
        setErrorMessage('Only CSV files are supported.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setErrorMessage(null);
    try {
      await onUpload(selectedFile);
      setIsUploading(false);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Dataset upload failed.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E5E7EB] shadow-modal relative animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">
              Upload Custom Dataset
            </h3>
            <p className="text-xs text-[#6B7280]">
              Upload a custom CSV file with a <code className="font-mono text-blue-600 bg-blue-50 px-1 py-0.5 rounded">species</code> target column
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dropzone Container */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#E5E7EB] hover:border-blue-500 bg-[#F8F9FB] rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <FileCheck className="w-10 h-10 text-emerald-600 mb-1" />
              <span className="text-sm font-semibold text-[#111827] font-mono">
                {selectedFile.name}
              </span>
              <span className="text-xs text-[#6B7280]">
                {(selectedFile.size / 1024).toFixed(1)} KB &bull; CSV File
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-blue-600 mb-1" />
              <span className="text-sm font-semibold text-[#111827]">
                Click or drag CSV file here
              </span>
              <span className="text-xs text-[#6B7280]">
                Supports files up to 10MB
              </span>
            </div>
          )}
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6B7280] hover:text-[#111827] bg-[#F8F9FB] rounded-xl border border-[#E5E7EB]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isUploading}
            className="px-5 py-2 text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-xl disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isUploading ? 'Validating & Uploading...' : 'Process Dataset'}
          </button>
        </div>
      </div>
    </div>
  );
};
