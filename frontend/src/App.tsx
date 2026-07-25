import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { ProjectHeader } from './components/ProjectHeader';
import { UploadPanel } from './components/UploadPanel';
import { DatasetPreviewCard } from './components/DatasetPreviewCard';
import { PipelineTimeline } from './components/PipelineTimeline';
import { KPICardSection } from './components/KPICard';
import { ModelInfoCard } from './components/ModelInfoCard';
import { DatasetInfoCard } from './components/DatasetInfoCard';
import { ConfusionMatrixViewer } from './components/ConfusionMatrixViewer';
import { MatrixSummaryCard } from './components/MatrixSummaryCard';
import { ClassificationReportTable } from './components/ClassificationReportTable';
import { ActionControlsBar } from './components/ActionControlsBar';
import { Footer } from './components/Footer';

import { PipelineResults, DatasetPreview, WorkflowStep } from './types/pipeline';
import {
  loadBuiltinDataset,
  uploadDatasetFile,
  runPipeline,
  resetPipelineBackend,
  getExportUrl,
} from './services/api';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>('IDLE');
  const [datasetPreview, setDatasetPreview] = useState<DatasetPreview | null>(null);
  const [timelineStep, setTimelineStep] = useState<number>(1);
  const [results, setResults] = useState<PipelineResults | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Clear previous results on initial load
  useEffect(() => {
    resetPipelineBackend().catch(() => {});
  }, []);

  const handleSelectBuiltin = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await loadBuiltinDataset();
      setDatasetPreview(res.preview);
      setWorkflowStep('PREVIEW');
    } catch (err: any) {
      setError(err.message || 'Failed to load built-in dataset.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      const res = await uploadDatasetFile(file);
      setDatasetPreview(res.preview);
      setWorkflowStep('PREVIEW');
    } catch (err: any) {
      setError(err.message || 'Failed to upload dataset file.');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunClassification = async () => {
    setIsProcessing(true);
    setError(null);
    setWorkflowStep('TRAINING');
    setTimelineStep(1);

    // Animate pipeline timeline steps sequentially
    const stepInterval = setInterval(() => {
      setTimelineStep((prev) => {
        if (prev < 9) return prev + 1;
        return prev;
      });
    }, 200);

    try {
      const pipelineResults = await runPipeline();

      clearInterval(stepInterval);
      setTimelineStep(9); // Show step 9 loading animation

      // Wait 600ms while step 9 shows spinning loader before marking completed
      setTimeout(() => {
        setResults(pipelineResults);
        setWorkflowStep('COMPLETED');
        setIsProcessing(false);
      }, 600);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(err.message || 'Classification execution failed.');
      setWorkflowStep('PREVIEW');
      setIsProcessing(false);
    }
  };

  const handleReset = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      await resetPipelineBackend();
    } catch (e) {
      // ignore
    } finally {
      setResults(null);
      setDatasetPreview(null);
      setTimelineStep(1);
      setWorkflowStep('IDLE');
      setIsProcessing(false);
    }
  };

  const handleExport = (fileType: 'json' | 'report' | 'matrix') => {
    const url = getExportUrl(fileType);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans text-[#111827]">
      {/* Top Navigation Bar */}
      <Navbar workflowStep={workflowStep} onReset={handleReset} />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-8">
        {/* Banner Alert for Errors */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between text-xs text-red-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Project Header */}
        <ProjectHeader
          onRunPipeline={handleRunClassification}
          onOpenUpload={() => handleReset()}
          onExport={handleExport}
          isExecuting={isProcessing}
          showExport={workflowStep === 'COMPLETED'}
        />

        {/* STEP 1: Upload Panel (Only when IDLE) */}
        {workflowStep === 'IDLE' && (
          <UploadPanel
            onUploadFile={handleUploadFile}
            onSelectBuiltin={handleSelectBuiltin}
            isProcessing={isProcessing}
          />
        )}

        {/* STEP 2 & 3: Dataset Preview Card (When dataset loaded) */}
        {(workflowStep === 'PREVIEW' || workflowStep === 'TRAINING' || workflowStep === 'COMPLETED') && datasetPreview && (
          <DatasetPreviewCard
            preview={datasetPreview}
            onRunClassification={handleRunClassification}
            isExecuting={isProcessing}
            onReset={handleReset}
          />
        )}

        {/* STEP 4: Animated Pipeline Execution Timeline (When TRAINING or COMPLETED) */}
        {(workflowStep === 'TRAINING' || workflowStep === 'COMPLETED') && (
          <PipelineTimeline currentStep={timelineStep} isCompleted={workflowStep === 'COMPLETED'} />
        )}

        {/* STEP 5: Results Dashboard (Revealed ONLY AFTER Completion) */}
        <AnimatePresence>
          {workflowStep === 'COMPLETED' && results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* KPI Cards Section */}
              <KPICardSection metrics={results.metrics} />

              {/* Information Section: Model & Dataset */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ModelInfoCard info={results.model_info} />
                <DatasetInfoCard info={results.dataset_info} />
              </div>

              {/* Hero Section: Confusion Matrix & Summary Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ConfusionMatrixViewer
                    matrixData={results.confusion_matrix}
                    onDownloadPNG={() => handleExport('matrix')}
                  />
                </div>
                <div className="lg:col-span-1">
                  <MatrixSummaryCard summary={results.confusion_matrix} />
                </div>
              </div>

              {/* Classification Report Table Section */}
              <ClassificationReportTable
                report={results.classification_report}
                onDownloadTXT={() => handleExport('report')}
              />

              {/* Operational Action Controls Bar */}
              <ActionControlsBar
                onOpenUpload={handleReset}
                onRunPipeline={handleRunClassification}
                onExportJSON={() => handleExport('json')}
                onExportReport={() => handleExport('report')}
                onExportMatrix={() => handleExport('matrix')}
                onReset={handleReset}
                isExecuting={isProcessing}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Enterprise Footer */}
      <Footer />
    </div>
  );
};

export default App;
