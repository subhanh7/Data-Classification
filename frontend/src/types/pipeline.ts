export interface PipelineMetrics {
  accuracy: number;
  precision_macro: number;
  recall_macro: number;
  f1_macro: number;
}

export interface ModelInfo {
  algorithm: string;
  n_neighbors: number;
  training_samples: number;
  testing_samples: number;
  scaler: string;
  model_path: string;
  random_seed: number;
  execution_time_ms?: number;
}

export interface DatasetInfo {
  name: string;
  samples: number;
  features_count: number;
  feature_names: string[];
  classes_count: number;
  class_names: string[];
  target_column: string;
  source: string;
}

export interface ConfusionMatrixData {
  image_url: string;
  image_b64: string | null;
  correct_predictions: number;
  incorrect_predictions: number;
  total_test_samples: number;
  accuracy_percent: number;
}

export interface ClassificationReportRow {
  class_name: string;
  precision: number;
  recall: number;
  f1_score: number;
  support: number;
}

export interface PipelineResults {
  status: string;
  metrics: PipelineMetrics;
  model_info: ModelInfo;
  dataset_info: DatasetInfo;
  confusion_matrix: ConfusionMatrixData;
  classification_report: ClassificationReportRow[];
}

export interface DatasetPreview {
  filename: string;
  format: string;
  rows: number;
  features_count: number;
  feature_names: string[];
  classes_count: number;
  class_names: string[];
  target_column: string;
  validation_status: string;
  source: string;
  upload_time: string;
}

export interface SystemStatus {
  status: string;
  model_trained: boolean;
  metrics_available: boolean;
  dataset_exists: boolean;
}

export type WorkflowStep = 'IDLE' | 'PREVIEW' | 'TRAINING' | 'COMPLETED';
