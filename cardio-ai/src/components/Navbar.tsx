import React from 'react';
import { Heart, FileDown } from 'lucide-react';

interface NavbarProps {
  onOpenReport: () => void;
  isAnalyzed: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReport,
  isAnalyzed,
}) => {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Simple Brand Logo */}
        <div className="brand-group" title="Cardio-AI">
          <div className="logo-badge">
            <Heart size={20} className="heart-icon heart-beat text-cyan" />
          </div>
          <div>
            <div className="brand-title">
              Cardio <span className="brand-ai">AI</span>
            </div>
            <div className="brand-subtitle">
              Cardiac MRI Segmentation & Hemodynamic Analysis
            </div>
          </div>
        </div>

        {/* Right side control: ONLY shown when uploaded and analyzed */}
        {isAnalyzed && (
          <div className="actions-group animate-fade-scale">
            <button
              className="btn btn-primary btn-sm nowrap navbar-report-btn"
              onClick={onOpenReport}
              title="Download Diagnostic Report"
            >
              <FileDown size={14} />
              <span>Download Report</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
