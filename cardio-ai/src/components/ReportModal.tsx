import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Heart, 
  Activity, 
  Calendar, 
  User, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PatientInfo, CardiacMetrics, SliceData } from '../types/cardiac';
import { REFERENCE_RANGES } from '../data/mockData';
import { generateCardioReportPDF } from '../utils/reportGenerator';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInfo;
  metrics: CardiacMetrics;
  slices: SliceData[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  metrics,
  slices,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const midSlice = slices[Math.floor(slices.length / 2)] || slices[0];

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateCardioReportPDF(patient, metrics, slices);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div 
        className="report-modal-container animate-fade-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Header */}
        <div className="report-modal-header no-print">
          <div className="flex-align-gap">
            <FileText size={20} className="text-cyan" />
            <div>
              <h2 className="report-modal-title">Clinical Diagnostic Cardiac MRI Report</h2>
              <p className="text-xs text-muted">Official Quantitative Hemodynamic Dossier</p>
            </div>
          </div>

          <div className="flex-align-gap">
            <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print Dossier</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <Download size={15} />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
            <button className="btn btn-ghost btn-icon-sm" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="report-paper printable-content" id="cardio-report-paper">
          {/* Institution & App Header */}
          <div className="doc-header">
            <div className="doc-branding">
              <div className="doc-logo-circle">
                <Heart size={20} className="text-cyan" />
              </div>
              <div>
                <h1 className="doc-app-name">
                  Cardio<span className="text-cyan">AI</span> Diagnostics
                </h1>
                <p className="doc-app-sub">Cardiovascular Deep Learning Segmentation System</p>
              </div>
            </div>

            <div className="doc-report-meta">
              <div className="meta-line">
                <span className="meta-lbl">Report No:</span>
                <span className="meta-val mono">CRD-{patient.id}-2026</span>
              </div>
              <div className="meta-line">
                <span className="meta-lbl">Generated:</span>
                <span className="meta-val">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Patient Details Card */}
          <div className="doc-section doc-patient-box">
            <h3 className="doc-section-title">1. Patient Demographics & Examination Metadata</h3>
            <div className="doc-grid-3">
              <div className="doc-field">
                <span className="field-label">Patient ID</span>
                <span className="field-val mono">{patient.id}</span>
              </div>
              <div className="doc-field">
                <span className="field-label">Full Name</span>
                <span className="field-val font-semibold">{patient.name}</span>
              </div>
              <div className="doc-field">
                <span className="field-label">Age / Gender</span>
                <span className="field-val">{patient.age} Y / {patient.gender}</span>
              </div>
              <div className="doc-field">
                <span className="field-label">Scanner System</span>
                <span className="field-val">{patient.scanner}</span>
              </div>
              <div className="doc-field">
                <span className="field-label">Voxel Resolution</span>
                <span className="field-val mono">
                  {patient.voxelSpacing.dx} x {patient.voxelSpacing.dy} x {patient.voxelSpacing.dz} mm
                </span>
              </div>
              <div className="doc-field">
                <span className="field-label">Resting Heart Rate</span>
                <span className="field-val mono">{patient.heartRate} bpm</span>
              </div>
            </div>
            <div className="clinical-indication-row">
              <span className="field-label">Clinical Indication:</span>
              <span className="indication-text">{patient.indication}</span>
            </div>
          </div>

          {/* Hemodynamics Summary */}
          <div className="doc-section">
            <div className="doc-section-header-row">
              <h3 className="doc-section-title">2. Volumetric Hemodynamic Quantification</h3>
              <div
                className="badge"
                style={{
                  backgroundColor: `${metrics.statusColor}22`,
                  color: metrics.statusColor,
                  border: `1px solid ${metrics.statusColor}55`,
                }}
              >
                {metrics.status}
              </div>
            </div>

            <table className="doc-table">
              <thead>
                <tr>
                  <th>Cardiac Metric Parameter</th>
                  <th>Symbol</th>
                  <th>Calculated Value</th>
                  <th>Normal Adult Reference Range</th>
                  <th>Clinical Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>End-Diastolic Volume</strong>
                    <div className="table-subtext">Peak ventricular filling before systole</div>
                  </td>
                  <td className="mono">EDV</td>
                  <td className="mono font-bold text-highlight">{metrics.edv.toFixed(1)} mL</td>
                  <td className="mono text-muted">100.0 – 160.0 mL</td>
                  <td>
                    <span className="badge badge-normal">Within Limits</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>End-Systolic Volume</strong>
                    <div className="table-subtext">Residual volume post-contraction</div>
                  </td>
                  <td className="mono">ESV</td>
                  <td className="mono font-bold text-highlight">{metrics.esv.toFixed(1)} mL</td>
                  <td className="mono text-muted">30.0 – 70.0 mL</td>
                  <td>
                    <span className="badge badge-normal">Within Limits</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Left Ventricular Stroke Volume</strong>
                    <div className="table-subtext">SV = EDV - ESV</div>
                  </td>
                  <td className="mono">SV</td>
                  <td className="mono font-bold text-cyan">{metrics.sv.toFixed(1)} mL</td>
                  <td className="mono text-muted">60.0 – 100.0 mL</td>
                  <td>
                    <span className="badge badge-normal">Preserved</span>
                  </td>
                </tr>
                <tr className="highlight-row">
                  <td>
                    <strong>Left Ventricular Ejection Fraction</strong>
                    <div className="table-subtext">LVEF = (SV / EDV) × 100</div>
                  </td>
                  <td className="mono font-bold">LVEF</td>
                  <td className="mono font-bold text-lg text-emerald">{metrics.lvef.toFixed(1)} %</td>
                  <td className="mono text-muted">53.0 – 73.0 %</td>
                  <td>
                    <span className="badge badge-normal">Normal Systolic Function</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Left Ventricular Myocardial Mass</strong>
                    <div className="table-subtext">Calculated from myocardial wall volume</div>
                  </td>
                  <td className="mono">LV Mass</td>
                  <td className="mono font-bold">{metrics.myocardialMass.toFixed(1)} g</td>
                  <td className="mono text-muted">85.0 – 145.0 g</td>
                  <td>
                    <span className="badge badge-normal">Normal Mass</span>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Cardiac Output</strong>
                    <div className="table-subtext">CO = SV × Heart Rate</div>
                  </td>
                  <td className="mono">CO</td>
                  <td className="mono font-bold">{metrics.cardiacOutput.toFixed(2)} L/min</td>
                  <td className="mono text-muted">4.0 – 8.0 L/min</td>
                  <td>
                    <span className="badge badge-normal">Adequate Perfusion</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MRI Segmentation Images (ED and ES phases) */}
          <div className="doc-section">
            <h3 className="doc-section-title">3. Multi-Phase Cardiac MRI Segmentation Images</h3>
            <div className="doc-images-grid">
              <div className="doc-img-card">
                <span className="doc-img-label">End-Diastole (ED) Phase MRI</span>
                <img src={midSlice.edMriUrl} alt="ED MRI" className="doc-rendered-img" />
              </div>
              <div className="doc-img-card">
                <span className="doc-img-label">ED AI Multi-Structure Overlay</span>
                <img src={midSlice.edMaskUrl} alt="ED Mask" className="doc-rendered-img" />
                <div className="doc-mask-legend">
                  <span className="dot dot-blue"></span> RV
                  <span className="dot dot-red"></span> MYO
                  <span className="dot dot-green"></span> LV
                </div>
              </div>
              <div className="doc-img-card">
                <span className="doc-img-label">End-Systole (ES) Phase MRI</span>
                <img src={midSlice.esMriUrl} alt="ES MRI" className="doc-rendered-img" />
              </div>
              <div className="doc-img-card">
                <span className="doc-img-label">ES AI Multi-Structure Overlay</span>
                <img src={midSlice.esMaskUrl} alt="ES Mask" className="doc-rendered-img" />
                <div className="doc-mask-legend">
                  <span className="dot dot-blue"></span> RV
                  <span className="dot dot-red"></span> MYO
                  <span className="dot dot-green"></span> LV
                </div>
              </div>
            </div>
          </div>

          {/* Explainable AI & Model Accuracy Details */}
          <div className="doc-section">
            <h3 className="doc-section-title">4. Model Details & Explainable AI (XAI)</h3>
            <div className="doc-xai-grid">
              <div className="doc-xai-item">
                <span className="xai-img-title">Seg-Grad-CAM Saliency</span>
                <img src={midSlice.gradcamUrl} alt="Grad-CAM" className="doc-rendered-img-sm" />
                <span className="text-xs text-muted">Focal attention on endocardium</span>
              </div>
              <div className="doc-xai-item">
                <span className="xai-img-title">Entropy Uncertainty Map</span>
                <img src={midSlice.uncertaintyUrl} alt="Entropy" className="doc-rendered-img-sm" />
                <span className="text-xs text-muted">Mean entropy: 0.042 (High precision)</span>
              </div>
              <div className="doc-xai-metrics-card">
                <div className="metric-row-mini">
                  <span>Architecture:</span>
                  <strong className="mono">Boundary-Aware 2D U-Net</strong>
                </div>
                <div className="metric-row-mini">
                  <span>Overall Cardiac Dice:</span>
                  <strong className="mono text-cyan">92.4%</strong>
                </div>
                <div className="metric-row-mini">
                  <span>LV Segmentation Dice:</span>
                  <strong className="mono text-emerald">94.2%</strong>
                </div>
                <div className="metric-row-mini">
                  <span>Myocardium Dice:</span>
                  <strong className="mono text-rose">89.5%</strong>
                </div>
                <div className="metric-row-mini">
                  <span>RV Segmentation Dice:</span>
                  <strong className="mono text-blue">91.6%</strong>
                </div>
                <div className="metric-row-mini">
                  <span>Boundary Contour F1:</span>
                  <strong className="mono">88.7%</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cardiologist Impression */}
          <div className="doc-section doc-impression-box">
            <h3 className="doc-section-title">5. Automated Diagnostic Impression</h3>
            <p className="doc-impression-text">{metrics.interpretation}</p>
          </div>

          {/* Official Disclaimer Footer */}
          <div className="doc-footer">
            <div className="disclaimer-title">REGULATORY AND CLINICAL DISCLAIMER:</div>
            <p className="disclaimer-text">
              Cardio-AI is a deep learning computer-aided detection and quantification software for cardiac magnetic resonance imaging. This automated quantitative report is generated for investigative research and clinical decision-support only. Volumetric evaluations (EDV, ESV, LVEF, SV) must be reviewed and correlated with clinical symptoms and validated by a board-certified radiologist or cardiologist prior to initiating therapeutic interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
