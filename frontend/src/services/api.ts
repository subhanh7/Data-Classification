import { PipelineResults, SystemStatus, DatasetPreview } from '../types/pipeline';

const API_BASE = '/api';

export async function fetchSystemStatus(): Promise<SystemStatus> {
  const response = await fetch(`${API_BASE}/status`);
  if (!response.ok) {
    throw new Error('Failed to check backend status');
  }
  return response.json();
}

export async function loadBuiltinDataset(): Promise<{ status: string; preview: DatasetPreview }> {
  const response = await fetch(`${API_BASE}/load-builtin`, {
    method: 'POST',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to load built-in dataset' }));
    throw new Error(errorData.detail || 'Failed to load built-in dataset');
  }
  return response.json();
}

export async function uploadDatasetFile(file: File): Promise<{ status: string; message: string; preview: DatasetPreview }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to upload dataset' }));
    throw new Error(errorData.detail || 'Dataset upload failed');
  }
  return response.json();
}

export async function runPipeline(): Promise<PipelineResults> {
  const response = await fetch(`${API_BASE}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Failed to execute pipeline' }));
    throw new Error(errorData.detail || 'Failed to execute pipeline');
  }
  return response.json();
}

export async function resetPipelineBackend(): Promise<void> {
  await fetch(`${API_BASE}/reset`, {
    method: 'POST',
  });
}

export function getExportUrl(fileType: 'json' | 'report' | 'matrix'): string {
  return `${API_BASE}/export/${fileType}`;
}
