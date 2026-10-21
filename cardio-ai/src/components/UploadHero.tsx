import React, { useState } from 'react';
import { 
  FileUp, 
  Heart, 
  FileCheck,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

interface UploadHeroProps {
  onStartAnalysis: (file: File) => void;
  isProcessing: boolean;
}

export const UploadHero: React.FC<UploadHeroProps> = ({
  onStartAnalysis,
  isProcessing,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onStartAnalysis(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onStartAnalysis(file);
    }
  };

  return (
    <div className="simple-upload-container animate-fade-scale">
      {/* Friendly Header */}
      <div className="simple-hero-header">
        <div className="hero-logo-badge animate-fade-scale">
          <Heart size={34} style={{ color: '#06b6d4', stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.18)' }} />
        </div>
        <h1 className="simple-hero-title">
          Cardio <span className="text-cyan">AI</span>
        </h1>
        <p className="simple-hero-sub">
          AI-Powered Cardiac MRI Segmentation & Volumetric Hemodynamic Intelligence
        </p>
      </div>

      {/* Upload Drop Zone Card */}
      <div className="glass-panel simple-upload-card">
        <div
          className={`simple-dropzone ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="simple-file-input"
            className="hidden-file-input"
            accept=".png,.jpg,.jpeg,.nii,.nii.gz,.dcm"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <label htmlFor="simple-file-input" className="simple-dropzone-label">
            {selectedFile ? (
              <div className="file-ready-box animate-fade-scale">
                <FileCheck size={48} className="text-emerald" />
                <div className="font-bold text-base mt-2">{selectedFile.name}</div>
                <div className="text-xs text-muted mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB • Processing model inference...
                </div>
              </div>
            ) : (
              <>
                <div className="upload-icon-wrapper">
                  <FileUp size={48} className="text-cyan" />
                </div>
                <div className="dropzone-text-primary">
                  <strong>Click to upload</strong> or drag and drop your Cardiac MRI scan
                </div>
                <div className="dropzone-text-sub text-xs text-muted">
                  Supports PNG, JPG, JPEG, and NIfTI (<code>.nii</code>, <code>.nii.gz</code>)
                </div>
              </>
            )}
          </label>
        </div>

        {/* Feature Badges */}
        <div className="upload-feature-row">
          <div className="feature-pill">
            <Zap size={13} className="text-cyan" />
            <span>3-Class Heart Segmentation (RV, Myo, LV)</span>
          </div>
          <div className="feature-pill">
            <Activity size={13} className="text-emerald" />
            <span>Hemodynamics (EDV, ESV, LVEF, SV)</span>
          </div>
          <div className="feature-pill">
            <ShieldCheck size={13} className="text-amber" />
            <span>Explainable AI & Uncertainty Maps</span>
          </div>
        </div>
      </div>
    </div>
  );
};

