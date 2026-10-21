import jsPDF from 'jspdf';
import { PatientInfo, CardiacMetrics, SliceData } from '../types/cardiac';

export const generateCardioReportPDF = async (
  patient: PatientInfo,
  metrics: CardiacMetrics,
  slices: SliceData[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [6, 182, 212]; // Cyan
  const darkBg = [15, 23, 42];        // Slate 900
  const textColor = [30, 41, 59];     // Slate 800
  const mutedText = [100, 116, 139];  // Slate 500

  // Page 1 Header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('Cardio-AI — Deep Cardiac MRI Quantitative Report', 14, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text('Automated Boundary-Aware U-Net Segmentation & Hemodynamic Assessment', 14, 22);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 27);

  // Patient Info Box
  let y = 42;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 34, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Patient & Study Metadata', 20, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  // Column 1
  doc.text(`Patient ID: ${patient.id}`, 20, y + 16);
  doc.text(`Patient Name: ${patient.name}`, 20, y + 22);
  doc.text(`Age / Gender: ${patient.age} yrs / ${patient.gender}`, 20, y + 28);

  // Column 2
  doc.text(`Study Date: ${patient.examDate}`, 85, y + 16);
  doc.text(`Scanner: ${patient.scanner}`, 85, y + 22);
  doc.text(`Heart Rate: ${patient.heartRate} bpm`, 85, y + 28);

  // Column 3
  doc.text(`Condition: ${patient.condition}`, 145, y + 16);
  doc.text(`Voxel Spacing: ${patient.voxelSpacing.dx}x${patient.voxelSpacing.dy}x${patient.voxelSpacing.dz}mm`, 145, y + 22);
  doc.text(`Cohort: ${patient.acdcCohortId}`, 145, y + 28);

  // Quantitative Hemodynamics Section
  y = 86;
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Volumetric Hemodynamic Indices', 14, y);

  // Summary status banner
  y += 5;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 12, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text(`Automated Diagnostic Status: `, 20, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`${metrics.status}`, 68, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`(LVEF: ${metrics.lvef.toFixed(1)}%)`, 125, y + 8);

  // Table
  y += 18;
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Parameter / Metric', 20, y + 5.5);
  doc.text('Calculated Value', 85, y + 5.5);
  doc.text('Normal Reference Range', 135, y + 5.5);

  const tableData = [
    { label: 'EDV (End-Diastolic Volume)', val: `${metrics.edv.toFixed(1)} mL`, ref: '100 - 160 mL' },
    { label: 'ESV (End-Systolic Volume)', val: `${metrics.esv.toFixed(1)} mL`, ref: '30 - 70 mL' },
    { label: 'SV (Stroke Volume = EDV - ESV)', val: `${metrics.sv.toFixed(1)} mL`, ref: '60 - 100 mL' },
    { label: 'LVEF (Ejection Fraction)', val: `${metrics.lvef.toFixed(1)} %`, ref: '53 - 73 %' },
    { label: 'Cardiac Output', val: `${metrics.cardiacOutput.toFixed(2)} L/min`, ref: '4.0 - 8.0 L/min' },
    { label: 'Myocardial Mass (LV)', val: `${metrics.myocardialMass.toFixed(1)} g`, ref: '85 - 145 g' },
    { label: 'Right Ventricular EF (RVEF)', val: `${metrics.rvef.toFixed(1)} %`, ref: '45 - 65 %' },
  ];

  y += 8;
  tableData.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, 182, 7, 'F');
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(row.label, 20, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.text(row.val, 85, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(row.ref, 135, y + 5);
    y += 7;
  });

  // Clinical Interpretation
  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Cardiologist Summary & Interpretation:', 20, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  const splitInterp = doc.splitTextToSize(metrics.interpretation, 172);
  doc.text(splitInterp, 20, y + 12);

  // Model Quality Metrics Table
  y += 30;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('AI Segmentation & Validation Quality', 14, y);

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Model Architecture: ${metrics.modelMetrics.architecture}`, 14, y);
  doc.text(`Overall Dice Score: ${(metrics.modelMetrics.overallDice * 100).toFixed(1)}%`, 85, y);
  doc.text(`Boundary F1: ${(metrics.modelMetrics.boundaryF1 * 100).toFixed(1)}%`, 145, y);

  y += 5;
  doc.text(`LV Dice: ${(metrics.modelMetrics.lvDice * 100).toFixed(1)}%`, 14, y);
  doc.text(`MYO Dice: ${(metrics.modelMetrics.myoDice * 100).toFixed(1)}%`, 85, y);
  doc.text(`RV Dice: ${(metrics.modelMetrics.rvDice * 100).toFixed(1)}%`, 145, y);

  // Regulatory Disclaimer Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, 196, 275);
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'DISCLAIMER: Cardio-AI is an investigative AI-assisted research and clinical decision-support tool. It is not an autonomous diagnostic device.',
    14,
    280
  );
  doc.text(
    'All volumetric measurements and segmentations must be reviewed and verified by a licensed imaging physician or radiologist.',
    14,
    284
  );

  // Save the PDF
  doc.save(`CardioAI_Report_${patient.id}_${patient.examDate}.pdf`);
};
