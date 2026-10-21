import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileUp, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Cpu, 
  ArrowRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { PatientInfo } from '../types/cardiac';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPatient: (patientId: string) => void;
  allPatients: PatientInfo[];
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onLoadPatient,
  allPatients,
}) => {
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    'Parsing NIfTI / DICOM Header & Voxel Spacing',
    'Intensity Min-Max Normalization to [0, 1]',
    'Executing Boundary-Aware 2D U-Net Inference',
    'Integrating Endocardial Volumes & Computing LVEF',
  ];

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRunInference = () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsProcessing(false);
            onLoadPatient('ACDC-001');
            onClose();
          }, 600);
          return prev;
        }
      });
    }, 700);
  };

  return (
    <div className="upload-modal-backdrop" onClick={onClose}>
      <div 
        className="upload-modal-container animate-fade-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="upload-modal-header">
          <div className="flex-align-gap">
            <Upload size={20} className="text-cyan" />
            <div>
              <h2 className="upload-modal-title">Upload Cardiac MRI Data</h2>
              <p className="text-xs text-muted">
                Accepts NIfTI (.nii, .nii.gz), DICOM (.dcm), or Cine 2D image slices
              </p>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon-sm" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="upload-modal-body">
          {/* Section 1: Pre-loaded ACDC Benchmark Cases */}
          <div className="preloaded-section">
            <div className="section-label-row">
              <Database size={15} className="text-cyan" />
              <span className="font-semibold text-sm">
                Or Load Pre-processed ACDC Benchmark Cohort:
              </span>
            </div>

            <div className="preloaded-cases-grid">
              {allPatients.map((p) => (
                <div
                  key={p.id}
                  className="patient-case-card"
                  onClick={() => {
                    onLoadPatient(p.id);
                    onClose();
                  }}
                >
                  <div className="case-card-top">
                    <span className="case-id mono font-semibold">{p.id}</span>
                    <span
                      className={`badge text-xs ${
                        p.condition.includes('Normal')
                          ? 'badge-normal'
                          : p.condition.includes('DCM')
                          ? 'badge-critical'
                          : 'badge-warning'
                      }`}
                    >
                      {p.condition.split(' ')[0]}
                    </span>
                  </div>
                  <div className="case-name">{p.name}</div>
                  <div className="case-details">
                    <span>{p.gender}, {p.age}y</span>
                    <span>•</span>
                    <span className="mono">{p.heartRate} bpm</span>
                    <span>•</span>
                    <span>{p.scanner.split(' ')[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="upload-divider">
            <span>OR UPLOAD CUSTOM FILE</span>
          </div>

          {/* Section 2: File Drop Zone */}
          <div
            className={`file-drop-zone ${dragOver ? 'drag-over' : ''} ${
              selectedFile ? 'file-ready' : ''
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="mri-file-input"
              className="hidden-file-input"
              accept=".nii,.nii.gz,.dcm,.zip,.png,.jpg,.jpeg"
              onChange={handleFileSelect}
            />

            <label htmlFor="mri-file-input" className="drop-zone-content">
              {selectedFile ? (
                <div className="selected-file-info animate-fade-scale">
                  <CheckCircle2 size={36} className="text-emerald" />
                  <div className="selected-name mono font-semibold">{selectedFile.name}</div>
                  <div className="selected-size text-xs text-muted">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for U-Net
                  </div>
                  <span className="text-xs text-cyan click-change">Click to choose another</span>
                </div>
              ) : (
                <>
                  <FileUp size={40} className="drop-icon text-cyan" />
                  <div className="drop-prompt">
                    <strong>Drag and drop cardiac scan here</strong> or{' '}
                    <span className="browse-link text-highlight">Browse filesystem</span>
                  </div>
                  <div className="drop-formats">
                    Supported: NIfTI (<code>.nii.gz</code>, <code>.nii</code>), DICOM (<code>.dcm</code>), PNG/JPEG cine slices
                  </div>
                </>
              )}
            </label>
          </div>

          {/* Processing Pipeline Animation */}
          {isProcessing && (
            <div className="processing-pipeline-box animate-fade-scale">
              <div className="pipeline-title-row">
                <Cpu size={16} className="text-cyan pulse" />
                <span className="text-xs font-semibold">
                  CardioSeg AI Neural Engine Running...
                </span>
              </div>

              <div className="pipeline-steps-list">
                {steps.map((st, idx) => (
                  <div
                    key={idx}
                    className={`pipeline-step-item ${
                      idx === currentStep
                        ? 'step-current'
                        : idx < currentStep
                        ? 'step-done'
                        : 'step-pending'
                    }`}
                  >
                    <div className="step-circle">
                      {idx < currentStep ? (
                        <CheckCircle2 size={12} className="text-emerald" />
                      ) : (
                        <span className="mono">{idx + 1}</span>
                      )}
                    </div>
                    <span className="step-text">{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="upload-modal-actions">
            <button className="btn btn-secondary" onClick={onClose} disabled={isProcessing}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleRunInference}
              disabled={!selectedFile || isProcessing}
            >
              <Sparkles size={16} />
              <span>{isProcessing ? 'Segmenting...' : 'Run CardioSeg AI Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
