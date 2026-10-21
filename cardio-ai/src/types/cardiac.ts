export interface PatientInfo {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weightKg: number;
  heightCm: number;
  heartRate: number; // bpm
  examDate: string;
  scanner: string;
  voxelSpacing: {
    dx: number; // mm
    dy: number; // mm
    dz: number; // mm (slice thickness)
  };
  condition: 'Normal' | 'Dilated Cardiomyopathy (DCM)' | 'Hypertrophic Cardiomyopathy (HCM)' | 'Myocardial Infarction (MINF)' | 'Arrhythmogenic RV Dysplasia (ARV)';
  indication: string;
  acdcCohortId: string;
}

export interface MetricRange {
  min: number;
  max: number;
  unit: string;
}

export interface CardiacMetrics {
  edv: number; // mL (End-Diastolic Volume)
  esv: number; // mL (End-Systolic Volume)
  sv: number;  // mL (Stroke Volume = EDV - ESV)
  lvef: number; // % (Left Ventricular Ejection Fraction = SV / EDV * 100)
  cardiacOutput: number; // L/min (SV * HR / 1000)
  myocardialMass: number; // g
  rvEdv: number; // mL (Right Ventricle EDV)
  rvEsv: number; // mL (Right Ventricle ESV)
  rvef: number; // % (Right Ventricle Ejection Fraction)
  status: 'Normal Systolic Function' | 'Mild Dysfunction' | 'Moderate Heart Failure' | 'Severe Systolic Dysfunction';
  statusColor: string;
  interpretation: string;
  modelMetrics: {
    architecture: string;
    overallDice: number;
    lvDice: number;
    myoDice: number;
    rvDice: number;
    boundaryF1: number;
    meanUncertainty: number;
    inferenceTimeMs: number;
  };
}

export interface SegmentationLayer {
  id: 'rv' | 'myo' | 'lv';
  label: string;
  anatomicalName: string;
  color: string;
  borderHex: string;
  visible: boolean;
  opacity: number;
  diceScore: number;
  volumeMl: number;
  thicknessMm?: number;
}

export interface SliceData {
  sliceIndex: number;
  mriUrl: string;
  maskUrl: string;
  overlayUrl: string;
  edMriUrl: string;
  edMaskUrl: string;
  esMriUrl: string;
  esMaskUrl: string;
  gradcamUrl: string;
  uncertaintyUrl: string;
  uncertaintyOverlayUrl: string;
  probRvUrl: string;
  probMyoUrl: string;
  probLvUrl: string;
  lvAreaCm2: number;
  myoAreaCm2: number;
  rvAreaCm2: number;
}

export interface AHA17Segment {
  id: number;
  name: string;
  region: 'Basal' | 'Mid-cavity' | 'Apical' | 'Apex';
  artery: 'LAD' | 'RCA' | 'LCx';
  wallMotion: 'Normal (1.0)' | 'Hypokinesis (2.0)' | 'Akinesis (3.0)' | 'Dyskinesis (4.0)';
  score: number;
  thicknessMm: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  category?: 'metric' | 'diagnosis' | 'segmentation' | 'general';
  citations?: string[];
  suggestedPrompts?: string[];
}

export type ViewMode = 'dashboard' | 'deep-inspection' | 'xai-studio' | 'cine-cine' | 'report-preview';
export type CardiacPhase = 'ED' | 'ES';
export type DisplayMode = 'overlay' | 'side-by-side' | 'raw-mri' | 'mask-only';
