import React from 'react';
import { Brain } from 'lucide-react';
import { SliceData, CardiacMetrics } from '../types/cardiac';

interface XAIPanelProps {
  activeSlice: SliceData;
  metrics: CardiacMetrics;
}

export const XAIPanel: React.FC<XAIPanelProps> = ({
  activeSlice,
  metrics,
}) => {
  return (
    <div className="glass-panel xai-panel-container">
      {/* XAI Header */}
      <div className="xai-header">
        <div className="flex-align-gap">
          <Brain size={20} className="text-purple pulse" />
          <div>
            <h2 className="xai-title">Explainable AI (XAI) Studio — 4-Quadrant Analysis</h2>
            <p className="xai-subtitle">
              Visual Interpretability, Multi-Mask Segmentation, Feature Saliency & Uncertainty
            </p>
          </div>
        </div>
      </div>

      {/* 4-Quadrant Analysis Grid */}
      <div className="xai-content-body">
        <div className="quadrant-grid animate-fade-scale">
          {/* Quadrant 1: Raw MRI */}
          <div className="quadrant-card">
            <div className="quadrant-card-header">
              <span className="quadrant-badge">1. Raw MRI Input</span>
              <span className="mono text-xs text-muted">Slice #{activeSlice.sliceIndex}</span>
            </div>
            <div className="quadrant-image-wrapper">
              <img
                src={activeSlice.edMriUrl}
                alt="Raw MRI input"
                className="quadrant-img"
              />
            </div>
            <div className="quadrant-card-footer">
              <span className="text-xs text-secondary">Original grayscale cardiac MRI acquisition</span>
            </div>
          </div>

          {/* Quadrant 2: Ground Truth / Multi-Mask */}
          <div className="quadrant-card">
            <div className="quadrant-card-header">
              <span className="quadrant-badge">2. Predicted Multi-Mask</span>
              <span className="badge badge-normal text-xs">
                Dice {(metrics.modelMetrics.overallDice * 100).toFixed(1)}%
              </span>
            </div>
            <div className="quadrant-image-wrapper">
              <img
                src={activeSlice.edMaskUrl}
                alt="AI segmentation mask"
                className="quadrant-img"
              />
            </div>
            <div className="quadrant-card-footer">
              <div className="mini-color-legend">
                <span className="dot dot-blue"></span> RV (Right Ventricle)
                <span className="dot dot-red"></span> MYO (Myocardium)
                <span className="dot dot-green"></span> LV (Left Ventricle)
              </div>
            </div>
          </div>

          {/* Quadrant 3: Seg-Grad-CAM Heatmap */}
          <div className="quadrant-card">
            <div className="quadrant-card-header">
              <span className="quadrant-badge">3. Seg-Grad-CAM Heatmap</span>
              <span className="badge badge-purple text-xs">Layer: conv2d_35</span>
            </div>
            <div className="quadrant-image-wrapper">
              <img
                src={activeSlice.gradcamUrl}
                alt="Seg-Grad-CAM feature saliency"
                className="quadrant-img"
              />
            </div>
            <div className="quadrant-card-footer">
              <span className="text-xs text-secondary">
                High gradients localize specifically to the left ventricular endocardium
              </span>
            </div>
          </div>

          {/* Quadrant 4: Uncertainty Map (Entropy) */}
          <div className="quadrant-card">
            <div className="quadrant-card-header">
              <span className="quadrant-badge">4. Shannon Entropy Uncertainty</span>
              <span className="badge badge-warning text-xs">
                Max H: {metrics.modelMetrics.meanUncertainty.toFixed(4)}
              </span>
            </div>
            <div className="quadrant-image-wrapper">
              <img
                src={activeSlice.uncertaintyUrl}
                alt="Uncertainty map entropy"
                className="quadrant-img"
              />
            </div>
            <div className="quadrant-card-footer">
              <span className="text-xs text-secondary">
                Dark = High confidence (&gt;99%), Warm = Boundary ambiguity (&lt;12%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
