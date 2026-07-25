import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, Activity } from 'lucide-react';

interface StepItem {
  id: number;
  label: string;
  description: string;
}

const STEPS: StepItem[] = [
  { id: 1, label: 'Load Dataset', description: 'Reading dataset rows into memory' },
  { id: 2, label: 'Validate Dataset', description: 'Checking feature types & missing values' },
  { id: 3, label: 'Train/Test Split', description: 'Splitting 80% train / 20% test set' },
  { id: 4, label: 'Feature Scaling', description: 'Fitting StandardScaler on train features' },
  { id: 5, label: 'Model Training', description: 'Fitting KNeighborsClassifier (K=5)' },
  { id: 6, label: 'Prediction', description: 'Predicting class labels for test set' },
  { id: 7, label: 'Evaluation', description: 'Computing Accuracy, Precision, Recall & F1' },
  { id: 8, label: 'Generate Outputs', description: 'Creating confusion matrix & report files' },
  { id: 9, label: 'Completed', description: 'Pipeline finished — revealing dashboard' },
];

interface PipelineTimelineProps {
  currentStep: number; // 1 to 9
  isCompleted?: boolean;
}

export const PipelineTimeline: React.FC<PipelineTimelineProps> = ({ currentStep, isCompleted = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-card hover:shadow-card-hover transition-all"
    >
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-2.5">
          <Activity className={`w-5 h-5 ${isCompleted ? 'text-emerald-600' : 'text-blue-600 animate-pulse'}`} />
          <div>
            <h3 className="text-base font-semibold text-[#111827]">
              Pipeline Execution Engine
            </h3>
            <p className="text-xs text-[#6B7280]">
              Real-time stage-by-stage supervised machine learning workflow
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 text-[11px] font-mono font-medium rounded-lg border ${
          isCompleted ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-blue-700 bg-blue-50 border-blue-100'
        }`}>
          {isCompleted ? 'All 9 Steps Completed' : `Step ${Math.min(currentStep, 9)} of 9`}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {STEPS.map((step) => {
          const isDone = isCompleted || currentStep > step.id;
          const isCurrent = !isCompleted && currentStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-2xl border transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                  : isCurrent
                  ? 'bg-blue-50/60 border-blue-300 text-blue-950 shadow-subtle ring-1 ring-blue-200'
                  : 'bg-[#F8F9FB] border-[#E5E7EB]/60 text-gray-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <div>
                  <span className={`text-xs font-semibold block ${
                    isDone ? 'text-emerald-900' : isCurrent ? 'text-blue-900 font-bold' : 'text-[#6B7280]'
                  }`}>
                    {step.id}. {step.label}
                  </span>
                  <span className="text-[11px] text-[#6B7280] block truncate">
                    {step.description}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
