import React from 'react';
import { motion } from 'framer-motion';
import { Target, Crosshair, Activity, Award } from 'lucide-react';
import { PipelineMetrics } from '../types/pipeline';

interface KPICardsProps {
  metrics: PipelineMetrics;
}

export const KPICardSection: React.FC<KPICardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'Accuracy',
      value: (metrics.accuracy * 100).toFixed(1) + '%',
      raw: metrics.accuracy.toFixed(4),
      description: 'Overall classification correctness',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Precision (Macro)',
      value: (metrics.precision_macro * 100).toFixed(1) + '%',
      raw: metrics.precision_macro.toFixed(4),
      description: 'Positive predictive ratio across classes',
      icon: Crosshair,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      title: 'Recall (Macro)',
      value: (metrics.recall_macro * 100).toFixed(1) + '%',
      raw: metrics.recall_macro.toFixed(4),
      description: 'Sensitivity across true class samples',
      icon: Activity,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'F1 Score (Macro)',
      value: (metrics.f1_macro * 100).toFixed(1) + '%',
      raw: metrics.f1_macro.toFixed(4),
      description: 'Harmonic mean of precision & recall',
      icon: Award,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-[#E5E7EB] rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#6B7280]">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl ${card.bg}`}>
                <Icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-bold tracking-tight text-[#111827] tabular-nums">
                {card.value}
              </span>
              <span className="text-xs font-mono text-[#6B7280]">
                ({card.raw})
              </span>
            </div>

            <p className="text-[12px] text-[#6B7280]">
              {card.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
