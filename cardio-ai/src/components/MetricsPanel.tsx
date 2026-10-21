import React, { useState } from 'react';
import { 
  Activity, 
  Heart, 
  HelpCircle, 
  Gauge, 
  TrendingUp, 
  BarChart2, 
  ShieldCheck, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { CardiacMetrics, PatientInfo, AHA17Segment } from '../types/cardiac';
import { REFERENCE_RANGES } from '../data/mockData';

interface MetricsPanelProps {
  metrics: CardiacMetrics;
  patient: PatientInfo;
  ahaSegments: AHA17Segment[];
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({
  metrics,
  patient,
  ahaSegments,
}) => {
  const [activeTab, setActiveTab] = useState<'hemodynamics' | 'bullseye' | 'model-quality'>('hemodynamics');
  const [hoveredSegment, setHoveredSegment] = useState<AHA17Segment | null>(null);

  // Helper function to calculate gauge progress percentage
  const getPercentageInRange = (val: number, min: number, max: number) => {
    const clamped = Math.max(min, Math.min(max, val));
    return ((clamped - min) / (max - min)) * 100;
  };

  return (
    <div className="glass-panel metrics-panel-container">
      {/* Panel Header & Tabs */}
      <div className="metrics-panel-header">
        <div className="flex-align-gap">
          <Activity size={18} className="text-cyan pulse" />
          <h3 className="metrics-panel-title">Volumetric Hemodynamics</h3>
        </div>

        <div className="metrics-tabs">
          <button
            className={`metrics-tab-btn ${activeTab === 'hemodynamics' ? 'active' : ''}`}
            onClick={() => setActiveTab('hemodynamics')}
          >
            Clinical Metrics
          </button>
          <button
            className={`metrics-tab-btn ${activeTab === 'bullseye' ? 'active' : ''}`}
            onClick={() => setActiveTab('bullseye')}
          >
            AHA 17-Polar Map
          </button>
          <button
            className={`metrics-tab-btn ${activeTab === 'model-quality' ? 'active' : ''}`}
            onClick={() => setActiveTab('model-quality')}
          >
            AI Accuracy
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="metrics-panel-body">
        {activeTab === 'hemodynamics' && (
          <div className="hemodynamics-view animate-fade-scale">
            {/* LVEF Hero Card */}
            <div className="hero-lvef-card">
              <div className="lvef-header">
                <div className="lvef-title-group">
                  <div className="metric-tag">Primary Systolic Index</div>
                  <div className="metric-title-lg">LVEF (Ejection Fraction)</div>
                </div>
                <div
                  className="lvef-badge-pill"
                  style={{
                    backgroundColor: `${metrics.statusColor}22`,
                    color: metrics.statusColor,
                    borderColor: `${metrics.statusColor}66`,
                  }}
                >
                  {metrics.status}
                </div>
              </div>

              <div className="lvef-value-row">
                <div className="lvef-big-number">
                  <span className="mono font-black">{metrics.lvef.toFixed(1)}</span>
                  <span className="unit">%</span>
                </div>
                <div className="lvef-formula-box">
                  <span className="formula-text">
                    LVEF = (SV / EDV) × 100
                  </span>
                  <span className="formula-calc mono nowrap">
                    ({metrics.sv.toFixed(1)} / {metrics.edv.toFixed(1)}) × 100
                  </span>
                </div>
              </div>

              {/* Visual Reference Gauge for LVEF */}
              <div className="gauge-track-container">
                <div className="gauge-zones">
                  <span className="zone-crit">Severe &lt;30%</span>
                  <span className="zone-mod">Moderate 30-40%</span>
                  <span className="zone-mild">Mild 40-52%</span>
                  <span className="zone-norm">Normal 53-73%</span>
                </div>
                <div className="gauge-bar-track">
                  <div
                    className="gauge-pointer"
                    style={{
                      left: `${Math.min(100, Math.max(5, (metrics.lvef / 80) * 100))}%`,
                      borderColor: metrics.statusColor,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Core 4 Hemodynamic Metrics Grid (EDV, ESV, SV, Mass) */}
            <div className="metrics-quad-grid">
              {/* 1. EDV: End-Diastolic Volume */}
              <div className="metric-quad-card">
                <div className="metric-card-header">
                  <span className="metric-symbol edv-symbol">EDV</span>
                  <span className="metric-card-title">End-Diastolic Vol</span>
                </div>
                <div className="metric-card-val mono">
                  <span className="val-number">{metrics.edv.toFixed(1)}</span>
                  <span className="metric-unit">mL</span>
                </div>
                <div className="metric-reference-row">
                  <span className="ref-label">Ref (Normal):</span>
                  <span className="ref-val mono nowrap">
                    {REFERENCE_RANGES.edv.min}–{REFERENCE_RANGES.edv.max} mL
                  </span>
                </div>
                <div className="mini-progress-bar">
                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${Math.min(100, (metrics.edv / 200) * 100)}%`,
                      backgroundColor: metrics.edv > 160 ? '#EF4444' : '#10B981',
                    }}
                  ></div>
                </div>
                <p className="metric-desc">
                  Blood volume in LV when fullest at end of diastole.
                </p>
              </div>

              {/* 2. ESV: End-Systolic Volume */}
              <div className="metric-quad-card">
                <div className="metric-card-header">
                  <span className="metric-symbol esv-symbol">ESV</span>
                  <span className="metric-card-title">End-Systolic Vol</span>
                </div>
                <div className="metric-card-val mono">
                  <span className="val-number">{metrics.esv.toFixed(1)}</span>
                  <span className="metric-unit">mL</span>
                </div>
                <div className="metric-reference-row">
                  <span className="ref-label">Ref (Normal):</span>
                  <span className="ref-val mono nowrap">
                    {REFERENCE_RANGES.esv.min}–{REFERENCE_RANGES.esv.max} mL
                  </span>
                </div>
                <div className="mini-progress-bar">
                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${Math.min(100, (metrics.esv / 120) * 100)}%`,
                      backgroundColor: metrics.esv > 70 ? '#EF4444' : '#10B981',
                    }}
                  ></div>
                </div>
                <p className="metric-desc">
                  Blood volume remaining in LV after contraction.
                </p>
              </div>

              {/* 3. SV: Stroke Volume */}
              <div className="metric-quad-card">
                <div className="metric-card-header">
                  <span className="metric-symbol sv-symbol">SV</span>
                  <span className="metric-card-title">Stroke Volume</span>
                </div>
                <div className="metric-card-val mono">
                  <span className="val-number">{metrics.sv.toFixed(1)}</span>
                  <span className="metric-unit">mL</span>
                </div>
                <div className="metric-reference-row">
                  <span className="ref-label">EDV - ESV:</span>
                  <span className="ref-val mono nowrap">
                    {metrics.edv.toFixed(1)} - {metrics.esv.toFixed(1)}
                  </span>
                </div>
                <div className="mini-progress-bar">
                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${Math.min(100, (metrics.sv / 110) * 100)}%`,
                      backgroundColor: '#3B82F6',
                    }}
                  ></div>
                </div>
                <p className="metric-desc">
                  Actual volume propelled into aorta per heartbeat.
                </p>
              </div>

              {/* 4. Myocardial Mass */}
              <div className="metric-quad-card">
                <div className="metric-card-header">
                  <span className="metric-symbol myo-symbol">LV Mass</span>
                  <span className="metric-card-title">Myocardial Mass</span>
                </div>
                <div className="metric-card-val mono">
                  <span className="val-number">{metrics.myocardialMass.toFixed(1)}</span>
                  <span className="metric-unit">g</span>
                </div>
                <div className="metric-reference-row">
                  <span className="ref-label">Ref (Normal):</span>
                  <span className="ref-val mono nowrap">85–145 g</span>
                </div>
                <div className="mini-progress-bar">
                  <div
                    className="mini-progress-fill"
                    style={{
                      width: `${Math.min(100, (metrics.myocardialMass / 220) * 100)}%`,
                      backgroundColor: metrics.myocardialMass > 160 ? '#F59E0B' : '#10B981',
                    }}
                  ></div>
                </div>
                <p className="metric-desc">
                  Estimated from epicardial minus endocardial volume.
                </p>
              </div>
            </div>

            {/* Secondary Hemodynamics (Cardiac Output, RV EF, Spacing) */}
            <div className="secondary-metrics-row">
              <div className="secondary-item">
                <span className="sec-label">Cardiac Output</span>
                <span className="sec-val mono text-highlight nowrap">
                  {metrics.cardiacOutput.toFixed(2)} L/min
                </span>
                <span className="sec-sub nowrap">at {patient.heartRate} bpm</span>
              </div>

              <div className="secondary-item">
                <span className="sec-label">Right Ventricle EF</span>
                <span className="sec-val mono text-highlight nowrap">
                  {metrics.rvef.toFixed(1)}%
                </span>
                <span className="sec-sub nowrap">EDV {metrics.rvEdv} mL</span>
              </div>

              <div className="secondary-item">
                <span className="sec-label">Voxel Spacing (3D)</span>
                <span className="sec-val mono text-highlight nowrap">
                  {patient.voxelSpacing.dx}×{patient.voxelSpacing.dz} mm
                </span>
                <span className="sec-sub nowrap">Thk: {patient.voxelSpacing.dz}mm</span>
              </div>
            </div>

            {/* Clinical Interpretation Card */}
            <div className="clinical-interpretation-card">
              <div className="interp-header">
                <ShieldCheck size={16} className="text-cyan" />
                <span className="interp-title">AI Clinical Diagnostic Assessment</span>
              </div>
              <p className="interp-text">{metrics.interpretation}</p>
            </div>
          </div>
        )}

        {/* Tab 2: AHA 17-Segment Polar Bullseye Visualization */}
        {activeTab === 'bullseye' && (
          <div className="bullseye-view animate-fade-scale">
            <div className="bullseye-header-row">
              <div>
                <h4 className="bullseye-title">AHA 17-Segment Cardiac Polar Map</h4>
                <p className="text-xs text-muted">
                  Standardized myocardial segmentation for regional wall motion & perfusion
                </p>
              </div>
              {hoveredSegment ? (
                <div className="segment-detail-badge animate-fade-scale">
                  <span className="mono font-semibold">Seg #{hoveredSegment.id}: {hoveredSegment.name}</span>
                  <span className="text-xs text-highlight">({hoveredSegment.artery})</span>
                  <span className="badge badge-cyan text-xs">{hoveredSegment.wallMotion}</span>
                  <span className="mono text-xs">{hoveredSegment.thicknessMm}mm</span>
                </div>
              ) : (
                <span className="text-xs text-secondary">Hover segment for wall motion</span>
              )}
            </div>

            {/* Interactive SVG Polar Bullseye */}
            <div className="bullseye-svg-wrapper">
              <svg viewBox="-120 -120 240 240" className="bullseye-svg">
                {/* Center Apex circle (Segment 17) */}
                <circle
                  cx="0"
                  cy="0"
                  r="22"
                  fill="#10B981"
                  stroke="#1e293b"
                  strokeWidth="1.5"
                  className="polar-segment"
                  onMouseEnter={() =>
                    setHoveredSegment(ahaSegments.find((s) => s.id === 17) || null)
                  }
                />
                <text x="0" y="4" textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="600">
                  17
                </text>

                {/* Apical Ring (Segments 13-16, r=22 to r=50) */}
                {[13, 14, 15, 16].map((segId, idx) => {
                  const seg = ahaSegments.find((s) => s.id === segId);
                  const angleStart = idx * 90 - 45;
                  const angleEnd = angleStart + 90;
                  const r1 = 22;
                  const r2 = 52;
                  const rad1 = (angleStart * Math.PI) / 180;
                  const rad2 = (angleEnd * Math.PI) / 180;
                  const x1 = r1 * Math.cos(rad1);
                  const y1 = r1 * Math.sin(rad1);
                  const x2 = r2 * Math.cos(rad1);
                  const y2 = r2 * Math.sin(rad1);
                  const x3 = r2 * Math.cos(rad2);
                  const y3 = r2 * Math.sin(rad2);
                  const x4 = r1 * Math.cos(rad2);
                  const y4 = r1 * Math.sin(rad2);

                  const path = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
                  const midAngle = ((angleStart + angleEnd) / 2) * (Math.PI / 180);
                  const textR = (r1 + r2) / 2;
                  const tx = textR * Math.cos(midAngle);
                  const ty = textR * Math.sin(midAngle) + 3;

                  return (
                    <g key={segId}>
                      <path
                        d={path}
                        fill={seg?.color || '#10B981'}
                        stroke="#1e293b"
                        strokeWidth="1.5"
                        className="polar-segment"
                        onMouseEnter={() => setHoveredSegment(seg || null)}
                      />
                      <text x={tx} y={ty} textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="600">
                        {segId}
                      </text>
                    </g>
                  );
                })}

                {/* Mid-Cavity Ring (Segments 7-12, r=52 to r=84) */}
                {[7, 8, 9, 10, 11, 12].map((segId, idx) => {
                  const seg = ahaSegments.find((s) => s.id === segId);
                  const angleStart = idx * 60 - 90;
                  const angleEnd = angleStart + 60;
                  const r1 = 52;
                  const r2 = 84;
                  const rad1 = (angleStart * Math.PI) / 180;
                  const rad2 = (angleEnd * Math.PI) / 180;
                  const x1 = r1 * Math.cos(rad1);
                  const y1 = r1 * Math.sin(rad1);
                  const x2 = r2 * Math.cos(rad1);
                  const y2 = r2 * Math.sin(rad1);
                  const x3 = r2 * Math.cos(rad2);
                  const y3 = r2 * Math.sin(rad2);
                  const x4 = r1 * Math.cos(rad2);
                  const y4 = r1 * Math.sin(rad2);

                  const path = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
                  const midAngle = ((angleStart + angleEnd) / 2) * (Math.PI / 180);
                  const textR = (r1 + r2) / 2;
                  const tx = textR * Math.cos(midAngle);
                  const ty = textR * Math.sin(midAngle) + 3;

                  return (
                    <g key={segId}>
                      <path
                        d={path}
                        fill={seg?.color || '#10B981'}
                        stroke="#1e293b"
                        strokeWidth="1.5"
                        className="polar-segment"
                        onMouseEnter={() => setHoveredSegment(seg || null)}
                      />
                      <text x={tx} y={ty} textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="600">
                        {segId}
                      </text>
                    </g>
                  );
                })}

                {/* Basal Ring (Segments 1-6, r=84 to r=116) */}
                {[1, 2, 3, 4, 5, 6].map((segId, idx) => {
                  const seg = ahaSegments.find((s) => s.id === segId);
                  const angleStart = idx * 60 - 90;
                  const angleEnd = angleStart + 60;
                  const r1 = 84;
                  const r2 = 116;
                  const rad1 = (angleStart * Math.PI) / 180;
                  const rad2 = (angleEnd * Math.PI) / 180;
                  const x1 = r1 * Math.cos(rad1);
                  const y1 = r1 * Math.sin(rad1);
                  const x2 = r2 * Math.cos(rad1);
                  const y2 = r2 * Math.sin(rad1);
                  const x3 = r2 * Math.cos(rad2);
                  const y3 = r2 * Math.sin(rad2);
                  const x4 = r1 * Math.cos(rad2);
                  const y4 = r1 * Math.sin(rad2);

                  const path = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;
                  const midAngle = ((angleStart + angleEnd) / 2) * (Math.PI / 180);
                  const textR = (r1 + r2) / 2;
                  const tx = textR * Math.cos(midAngle);
                  const ty = textR * Math.sin(midAngle) + 3;

                  return (
                    <g key={segId}>
                      <path
                        d={path}
                        fill={seg?.color || '#10B981'}
                        stroke="#1e293b"
                        strokeWidth="1.5"
                        className="polar-segment"
                        onMouseEnter={() => setHoveredSegment(seg || null)}
                      />
                      <text x={tx} y={ty} textAnchor="middle" fontSize="9" fill="#ffffff" fontWeight="600">
                        {segId}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Bullseye Color Legend */}
            <div className="bullseye-legend">
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#10B981' }}></span>
                <span>Normal (1.0)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#F59E0B' }}></span>
                <span>Hypokinesis (2.0)</span>
              </div>
              <div className="legend-item">
                <span className="legend-swatch" style={{ background: '#EF4444' }}></span>
                <span>Akinesis / Scar (3.0)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Model Quality & Segmentation Metrics */}
        {activeTab === 'model-quality' && (
          <div className="model-quality-view animate-fade-scale">
            <div className="quality-card-header">
              <span className="badge badge-cyan">CardioSeg Boundary U-Net</span>
              <span className="text-xs text-muted">Test Evaluation on ACDC Benchmark</span>
            </div>

            <div className="quality-metrics-table">
              <div className="quality-row">
                <span className="q-label">Overall Cardiac Dice</span>
                <span className="q-val mono text-highlight">
                  {(metrics.modelMetrics.overallDice * 100).toFixed(1)}%
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">Left Ventricle (LV) Dice</span>
                <span className="q-val mono text-emerald">
                  {(metrics.modelMetrics.lvDice * 100).toFixed(1)}%
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">Myocardium (MYO) Dice</span>
                <span className="q-val mono text-rose">
                  {(metrics.modelMetrics.myoDice * 100).toFixed(1)}%
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">Right Ventricle (RV) Dice</span>
                <span className="q-val mono text-blue">
                  {(metrics.modelMetrics.rvDice * 100).toFixed(1)}%
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">Boundary F1 Contour Score</span>
                <span className="q-val mono">
                  {(metrics.modelMetrics.boundaryF1 * 100).toFixed(1)}%
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">Mean Shannon Entropy Uncertainty</span>
                <span className="q-val mono">
                  {metrics.modelMetrics.meanUncertainty.toFixed(4)}
                </span>
              </div>
              <div className="quality-row">
                <span className="q-label">GPU Inference Latency</span>
                <span className="q-val mono">
                  {metrics.modelMetrics.inferenceTimeMs} ms / slice
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
