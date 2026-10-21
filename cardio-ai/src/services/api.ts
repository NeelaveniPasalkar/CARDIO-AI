/**
 * Cardio-AI API Client
 * Connects directly to the FastAPI backend defined in CardioSeg_AI_Project_(1).ipynb:
 * - GET /health
 * - GET /model-status
 * - POST /upload-mri
 * - POST /predict
 * - POST /analyze-nifti
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

export interface BackendModelStatus {
  model: string;
  architecture: string;
  input_size: string;
  output_classes: number;
  classes: Record<string, string>;
  parameters?: number;
  status: string;
}

export interface UploadMRIResponse {
  status: string;
  file_type: string;
  filename: string;
  path: string;
  shape?: number[];
  voxel_spacing_mm?: number[];
  image_size?: number[];
  analysis_type: string;
  message: string;
}

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
};

export const fetchModelStatus = async (): Promise<BackendModelStatus | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/model-status`, { method: 'GET' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const uploadMRIFile = async (file: File): Promise<UploadMRIResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload-mri`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(err.detail || 'Upload failed');
  }

  return await res.json();
};

export const runPredictMRI = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Prediction failed' }));
    throw new Error(err.detail || 'Prediction failed');
  }

  return await res.json();
};
