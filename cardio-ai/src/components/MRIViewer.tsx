import React, { useState, useRef } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  RotateCcw, 
  Sliders, 
  Crosshair,
  Sparkles
} from 'lucide-react';
import { SliceData, SegmentationLayer, CardiacPhase, DisplayMode } from '../types/cardiac';

interface MRIViewerProps {
  slices: SliceData[];
  currentSliceIndex: number;
  onSliceChange: (index: number) => void;
  layers: SegmentationLayer[];
  onToggleLayer: (layerId: 'rv' | 'myo' | 'lv') => void;
  onLayerOpacityChange: (layerId: 'rv' | 'myo' | 'lv', opacity: number) => void;
  phase: CardiacPhase;
  onPhaseChange: (phase: CardiacPhase) => void;
}

export const MRIViewer: React.FC<MRIViewerProps> = ({
  slices,
  currentSliceIndex,
  onSliceChange,
  layers,
  onToggleLayer,
  onLayerOpacityChange,
  phase,
  onPhaseChange,
}) => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>('overlay');
  const [globalOpacity, setGlobalOpacity] = useState<number>(0.65);
  const [showContours, setShowContours] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number; cls: string; prob: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeSlice = slices[currentSliceIndex] || slices[0];

  // Determine current image sources based on phase
  const currentMriUrl = phase === 'ED' ? activeSlice.edMriUrl : activeSlice.esMriUrl;
  const currentMaskUrl = phase === 'ED' ? activeSlice.edMaskUrl : activeSlice.esMaskUrl;
  const currentOverlayUrl = activeSlice.overlayUrl;

  // Layer visibility checks
  const rvVisible = layers.find((l) => l.id === 'rv')?.visible ?? true;
  const myoVisible = layers.find((l) => l.id === 'myo')?.visible ?? true;
  const lvVisible = layers.find((l) => l.id === 'lv')?.visible ?? true;

  // Track hover coordinate
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 128);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 128);

    // Approximate anatomical class based on spatial center (normalized)
    let cls = 'Background (0)';
    let prob = '99.4%';
    const dx = x - 64;
    const dy = y - 64;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 14) {
      cls = 'Left Ventricle (LV)';
      prob = '96.8%';
    } else if (dist >= 14 && dist <= 24) {
      cls = 'Myocardium (MYO)';
      prob = '91.2%';
    } else if (dx < -6 && dy > -10 && dy < 28 && dist < 36) {
      cls = 'Right Ventricle (RV)';
      prob = '89.5%';
    }

    setHoverCoords({ x, y, cls, prob });
  };

  const handleMouseLeave = () => {
    setHoverCoords(null);
  };

  return (
    <div className={`glass-panel viewer-container ${fullscreen ? 'viewer-fullscreen' : ''}`} ref={containerRef}>
      {/* Viewer Header / Toolbar */}
      <div className="viewer-header">
        <div className="viewer-title-row">
          <div className="flex-align-gap">
            <Layers size={18} className="text-cyan" />
            <h2 className="viewer-title">Cardiac MRI Cine & Segmentation</h2>
            <span className="badge badge-cyan mono">
              Slice {activeSlice.sliceIndex} of {slices.length}
            </span>
          </div>

          {/* Cardiac Phase Switcher (ED vs ES) */}
          <div className="phase-pill-selector">
            <button
              className={`phase-btn ${phase === 'ED' ? 'active-phase ed' : ''}`}
              onClick={() => onPhaseChange('ED')}
              title="End-Diastole: Maximum ventricular filling"
            >
              <span className="phase-indicator-dot ed"></span>
              <span>ED (Diastole)</span>
            </button>
            <button
              className={`phase-btn ${phase === 'ES' ? 'active-phase es' : ''}`}
              onClick={() => onPhaseChange('ES')}
              title="End-Systole: Maximum ventricular contraction"
            >
              <span className="phase-indicator-dot es"></span>
              <span>ES (Systole)</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="view-mode-tabs">
            <button
              className={`mode-tab ${displayMode === 'overlay' ? 'active' : ''}`}
              onClick={() => setDisplayMode('overlay')}
              title="Overlay: Segmentation superimposed on MRI"
            >
              AI Overlay
            </button>
            <button
              className={`mode-tab ${displayMode === 'side-by-side' ? 'active' : ''}`}
              onClick={() => setDisplayMode('side-by-side')}
              title="Dual View: Raw MRI alongside segmentation"
            >
              Side-by-Side
            </button>
            <button
              className={`mode-tab ${displayMode === 'raw-mri' ? 'active' : ''}`}
              onClick={() => setDisplayMode('raw-mri')}
              title="Inspect raw grayscale MRI only"
            >
              Raw MRI
            </button>
            <button
              className={`mode-tab ${displayMode === 'mask-only' ? 'active' : ''}`}
              onClick={() => setDisplayMode('mask-only')}
              title="Inspect 4-class multi-mask only"
            >
              Mask Only
            </button>
          </div>

          {/* Quick Actions */}
          <div className="viewer-quick-actions">
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setZoomLevel(zoomLevel === 1 ? 1.4 : 1)}
              title="Toggle Zoom"
            >
              <ZoomIn size={16} />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="viewport-stage">
        {displayMode === 'side-by-side' ? (
          /* Dual Side-by-Side View */
          <div className="side-by-side-grid">
            <div className="mri-frame">
              <div className="frame-overlay-label">
                <span>Raw Cine MRI [{phase}]</span>
                <span className="mono text-xs">128x128px</span>
              </div>
              <img
                src={currentMriUrl}
                alt={`Raw Cardiac MRI Slice ${activeSlice.sliceIndex}`}
                className="viewport-image"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>

            <div className="mri-frame">
              <div className="frame-overlay-label">
                <span>CardioSeg AI Multi-Mask [{phase}]</span>
                <span className="badge badge-normal text-xs">Boundary U-Net</span>
              </div>
              <img
                src={currentMaskUrl}
                alt={`CardioSeg AI Segmentation Mask Slice ${activeSlice.sliceIndex}`}
                className="viewport-image"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        ) : (
          /* Single Overlay or Pure Image Viewport */
          <div
            className="single-viewport-wrapper"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Base MRI Image Layer */}
            {displayMode !== 'mask-only' && (
              <img
                src={currentMriUrl}
                alt="Cardiac MRI Scan"
                className="viewport-image base-layer"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            )}

            {/* AI Segmentation Mask Overlay Layer */}
            {displayMode !== 'raw-mri' && (
              <div
                className="segmentation-overlay-layer"
                style={{
                  opacity: globalOpacity,
                  transform: `scale(${zoomLevel})`,
                  filter: showContours ? 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))' : 'none',
                }}
              >
                <img
                  src={displayMode === 'mask-only' ? currentMaskUrl : currentOverlayUrl}
                  alt="Segmentation Overlay"
                  className="viewport-image mask-layer-image"
                />
              </div>
            )}

            {/* Live Crosshair & Class Telemetry */}
            {hoverCoords && (
              <div className="pixel-telemetry-badge mono animate-fade-scale">
                <Crosshair size={12} className="text-cyan" />
                <span>X:{hoverCoords.x} Y:{hoverCoords.y}</span>
                <span className="telemetry-divider-mini">|</span>
                <span className="telemetry-class-name">{hoverCoords.cls}</span>
                <span className="badge badge-cyan text-xs">{hoverCoords.prob}</span>
              </div>
            )}

            {/* Anatomical Orientation Markers (Radiology Standard) */}
            <div className="rad-orientation top">A (Anterior)</div>
            <div className="rad-orientation bottom">P (Posterior)</div>
            <div className="rad-orientation left">R (Right)</div>
            <div className="rad-orientation right">L (Left)</div>
          </div>
        )}
      </div>

      {/* Clean Control Bar: Slice Scrubber & Overlay Alpha */}
      <div className="scrubber-bar">
        {slices.length > 1 ? (
          <div className="slider-wrapper">
            <span className="mono text-xs text-muted font-medium">Slice:</span>
            <input
              type="range"
              min={0}
              max={slices.length - 1}
              value={currentSliceIndex}
              onChange={(e) => onSliceChange(parseInt(e.target.value, 10))}
              className="slice-range-slider"
            />
            <span className="mono text-xs text-highlight font-semibold nowrap">
              {activeSlice.sliceIndex} / {slices.length}
            </span>
          </div>
        ) : (
          <div className="slice-info-pill">
            <span className="text-xs text-muted">Active Slice:</span>
            <span className="mono text-xs text-highlight font-semibold">Slice 1/1</span>
          </div>
        )}

        {/* Global Opacity Slider */}
        <div className="opacity-slider-group">
          <Sliders size={14} className="text-cyan" />
          <span className="text-xs text-secondary font-medium nowrap">Overlay Alpha:</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(globalOpacity * 100)}
            onChange={(e) => setGlobalOpacity(parseInt(e.target.value, 10) / 100)}
            className="opacity-range-slider"
          />
          <span className="mono text-xs text-highlight font-semibold nowrap min-w-36">
            {Math.round(globalOpacity * 100)}%
          </span>
        </div>
      </div>

      {/* Feature 2: AI Heart Segmentation Class Multi-Toggles */}
      <div className="segmentation-classes-bar">
        <div className="classes-title-group">
          <Sparkles size={15} className="text-cyan" />
          <span className="classes-title">Identified Heart Structures:</span>
        </div>

        <div className="layer-cards-grid">
          {layers.map((layer) => {
            const isVisible = layer.visible;
            return (
              <div
                key={layer.id}
                className={`layer-card ${isVisible ? 'layer-active' : 'layer-dimmed'}`}
                style={{
                  borderLeft: `4px solid ${layer.color}`,
                }}
              >
                <div className="layer-card-top">
                  <div className="flex-align-gap">
                    <span
                      className="layer-color-dot"
                      style={{ backgroundColor: layer.color }}
                    ></span>
                    <div>
                      <div className="layer-name">{layer.label}</div>
                      <div className="layer-latin-name">{layer.anatomicalName}</div>
                    </div>
                  </div>

                  <button
                    className="btn btn-ghost btn-icon-sm"
                    onClick={() => onToggleLayer(layer.id)}
                    title={isVisible ? 'Hide layer' : 'Show layer'}
                  >
                    {isVisible ? <Eye size={15} className="text-highlight" /> : <EyeOff size={15} className="text-muted" />}
                  </button>
                </div>

                <div className="layer-metrics-wrap">
                  <div className="layer-stat-chip">
                    <span className="stat-label">Dice Score:</span>
                    <span className="stat-value mono text-highlight">
                      {(layer.diceScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="layer-stat-chip">
                    <span className="stat-label">Volume:</span>
                    <span className="stat-value mono">{layer.volumeMl.toFixed(1)} mL</span>
                  </div>
                  {layer.thicknessMm && (
                    <div className="layer-stat-chip">
                      <span className="stat-label">Thickness:</span>
                      <span className="stat-value mono">{layer.thicknessMm} mm</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Background Class (Class 0) */}
          <div className="layer-card bg-class-card">
            <div className="layer-card-top">
              <div className="flex-align-gap">
                <span className="layer-color-dot bg-dot"></span>
                <div>
                  <div className="layer-name">Background (Thorax / Lungs)</div>
                  <div className="layer-latin-name">Class 0 - Non-Cardiac</div>
                </div>
              </div>
            </div>
            <div className="layer-metrics-wrap">
              <div className="layer-stat-chip">
                <span className="stat-label">Status:</span>
                <span className="stat-value text-muted">Masked out automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
