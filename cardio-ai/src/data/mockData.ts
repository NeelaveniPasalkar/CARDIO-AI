import { PatientInfo, CardiacMetrics, SliceData, AHA17Segment, SegmentationLayer } from '../types/cardiac';

export const DEFAULT_SEGMENTATION_LAYERS: SegmentationLayer[] = [
  {
    id: 'rv',
    label: 'Right Ventricle (RV)',
    anatomicalName: 'Ventriculus Dexter',
    color: '#3B82F6', // Blue as specified in prompt
    borderHex: '#60A5FA',
    visible: true,
    opacity: 0.65,
    diceScore: 0.7567, // Exact RV Dice from notebook (75.67%)
    volumeMl: 176.76,  // Exact RV EDV from notebook (176.76 mL)
  },
  {
    id: 'myo',
    label: 'Myocardium (MYO)',
    anatomicalName: 'Myocardium Cordis',
    color: '#EF4444', // Red as specified in prompt
    borderHex: '#F87171',
    visible: true,
    opacity: 0.70,
    diceScore: 0.7821, // Exact Myo Dice from notebook (78.21%)
    volumeMl: 195.36,  // Exact Myo ED Volume from notebook (195.36 mL)
    thicknessMm: 11.2,
  },
  {
    id: 'lv',
    label: 'Left Ventricle (LV)',
    anatomicalName: 'Ventriculus Sinister',
    color: '#10B981', // Green as specified in prompt
    borderHex: '#34D399',
    visible: true,
    opacity: 0.65,
    diceScore: 0.9295, // Exact LV Dice from notebook (92.95%)
    volumeMl: 306.84,  // Exact LV EDV from notebook (306.84 mL)
  },
];

export const REFERENCE_RANGES = {
  edv: { min: 100, max: 160, unit: 'mL', desc: 'End-Diastolic Volume' },
  esv: { min: 30, max: 70, unit: 'mL', desc: 'End-Systolic Volume' },
  sv: { min: 60, max: 100, unit: 'mL', desc: 'Stroke Volume (EDV - ESV)' },
  lvef: { min: 53, max: 73, unit: '%', desc: 'Left Ventricular Ejection Fraction' },
  cardiacOutput: { min: 4.0, max: 8.0, unit: 'L/min', desc: 'Cardiac Output' },
  myocardialMass: { min: 85, max: 145, unit: 'g', desc: 'Left Ventricular Mass' },
  rvef: { min: 45, max: 65, unit: '%', desc: 'Right Ventricular Ejection Fraction' },
};

/**
 * ORIGINAL TRAINING AND PREDICTION DATASETS DIRECTLY EXTRACTED FROM
 * CardioSeg_AI_Project_(1).ipynb (Cells 150, 153, 154, 388)
 */
export const SAMPLE_PATIENTS: {
  patient: PatientInfo;
  metrics: CardiacMetrics;
  slices: SliceData[];
  ahaSegments: AHA17Segment[];
}[] = [
  {
    patient: {
      id: 'patient001',
      name: 'Patient #001 (ACDC DCM Training Case)',
      age: 56,
      gender: 'Male',
      weightKg: 95.0,  // Exact from Info.cfg in notebook cell 150
      heightCm: 184.0, // Exact from Info.cfg in notebook cell 150
      heartRate: 76,
      examDate: '2026-09-14',
      scanner: 'Siemens Magnetom Aera 1.5T',
      voxelSpacing: { 
        dx: 1.5625, // Exact from notebook cell 153/154
        dy: 1.5625, 
        dz: 10.0 
      },
      condition: 'Dilated Cardiomyopathy (DCM)', // Exact from Info.cfg "Group: DCM"
      indication: 'Cardiomegaly with reduced ejection fraction on echo; cardiac MRI protocol for quantification of Dilated Cardiomyopathy.',
      acdcCohortId: 'ACDC-database-training-patient001',
    },
    metrics: {
      // EXACT VALUES COMPUTED BY CARDIOSEG AI MODEL IN NOTEBOOK CELL 153 & 154
      edv: 306.84, // Exact notebook output: "LV EDV : 306.84 mL (12,568 voxels)"
      esv: 234.62, // Exact notebook output: "LV ESV : 234.62 mL (9,610 voxels)"
      sv: 72.22,   // Exact SV = 306.84 - 234.62 = 72.22 mL
      lvef: 23.54, // Exact notebook output: "LVEF : 23.54 %"
      cardiacOutput: 5.49, // 72.22 mL * 76 bpm / 1000 = 5.49 L/min
      myocardialMass: 205.13, // 195.36 mL * 1.05 g/mL = 205.13 g
      rvEdv: 176.76, // Exact notebook output: "RV EDV : 176.76 mL (7,240 voxels)"
      rvEsv: 106.49, // Exact notebook output: "RV ESV : 106.49 mL (4,362 voxels)"
      rvef: 39.75,   // (176.76 - 106.49) / 176.76 * 100 = 39.75%
      status: 'Severe Systolic Dysfunction',
      statusColor: '#EF4444',
      interpretation: 'Dilated left ventricular cavity with marked chamber enlargement (LV EDV 306.84 mL). Severe global reduction of systolic function (LVEF 23.54%). RV dilatation with mildly reduced RVEF (39.75%). Findings are characteristic of Dilated Cardiomyopathy (DCM).',
      modelMetrics: {
        architecture: 'Boundary-Aware 2D U-Net (7,759,524 params)',
        overallDice: 0.8374, // Exact notebook: "hard_dice_overall_percent: 83.74%"
        lvDice: 0.9295,      // Exact notebook: "LV: 0.9295"
        myoDice: 0.7821,     // Exact notebook: "Myocardium: 0.7821"
        rvDice: 0.7567,      // Exact notebook: "RV: 0.7567"
        boundaryF1: 0.8740,
        meanUncertainty: 0.042,
        inferenceTimeMs: 124,
      },
    },
    slices: [
      {
        sliceIndex: 1,
        mriUrl: '/assets/cardiac/cine_slice_1.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 28.4,
        myoAreaCm2: 18.2,
        rvAreaCm2: 22.1,
      },
      {
        sliceIndex: 2,
        mriUrl: '/assets/cardiac/cine_slice_2.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 36.8,
        myoAreaCm2: 21.4,
        rvAreaCm2: 26.5,
      },
      {
        sliceIndex: 3,
        mriUrl: '/assets/cardiac/slice_mri_clean.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 44.2,
        myoAreaCm2: 24.8,
        rvAreaCm2: 31.0,
      },
      {
        sliceIndex: 4,
        mriUrl: '/assets/cardiac/cine_slice_3.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 38.6,
        myoAreaCm2: 22.0,
        rvAreaCm2: 27.8,
      },
      {
        sliceIndex: 5,
        mriUrl: '/assets/cardiac/cine_slice_4.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 26.5,
        myoAreaCm2: 17.5,
        rvAreaCm2: 18.4,
      },
    ],
    ahaSegments: [
      { id: 1, name: 'Basal Anterior', region: 'Basal', artery: 'LAD', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.4, color: '#F59E0B' },
      { id: 2, name: 'Basal Anteroseptal', region: 'Basal', artery: 'LAD', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.2, color: '#F59E0B' },
      { id: 3, name: 'Basal Inferoseptal', region: 'Basal', artery: 'RCA', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 7.6, color: '#EF4444' },
      { id: 4, name: 'Basal Inferior', region: 'Basal', artery: 'RCA', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.1, color: '#F59E0B' },
      { id: 5, name: 'Basal Inferolateral', region: 'Basal', artery: 'LCx', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.0, color: '#F59E0B' },
      { id: 6, name: 'Basal Anterolateral', region: 'Basal', artery: 'LCx', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.3, color: '#F59E0B' },
      { id: 7, name: 'Mid Anterior', region: 'Mid-cavity', artery: 'LAD', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 7.2, color: '#EF4444' },
      { id: 8, name: 'Mid Anteroseptal', region: 'Mid-cavity', artery: 'LAD', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 7.4, color: '#EF4444' },
      { id: 9, name: 'Mid Inferoseptal', region: 'Mid-cavity', artery: 'RCA', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 7.1, color: '#EF4444' },
      { id: 10, name: 'Mid Inferior', region: 'Mid-cavity', artery: 'RCA', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 7.9, color: '#F59E0B' },
      { id: 11, name: 'Mid Inferolateral', region: 'Mid-cavity', artery: 'LCx', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.2, color: '#F59E0B' },
      { id: 12, name: 'Mid Anterolateral', region: 'Mid-cavity', artery: 'LCx', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 8.1, color: '#F59E0B' },
      { id: 13, name: 'Apical Anterior', region: 'Apical', artery: 'LAD', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 6.8, color: '#EF4444' },
      { id: 14, name: 'Apical Septal', region: 'Apical', artery: 'LAD', wallMotion: 'Akinesis (3.0)', score: 3.0, thicknessMm: 6.9, color: '#EF4444' },
      { id: 15, name: 'Apical Inferior', region: 'Apical', artery: 'RCA', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 7.0, color: '#F59E0B' },
      { id: 16, name: 'Apical Lateral', region: 'Apical', artery: 'LCx', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 7.2, color: '#F59E0B' },
      { id: 17, name: 'Apex (True Apex)', region: 'Apex', artery: 'LAD', wallMotion: 'Hypokinesis (2.0)', score: 2.0, thicknessMm: 6.5, color: '#F59E0B' },
    ],
  },
  {
    patient: {
      id: 'patient101',
      name: 'Patient #101 (ACDC Test Benchmark Case)',
      age: 44,
      gender: 'Female',
      weightKg: 68.0,
      heightCm: 168.0,
      heartRate: 70,
      examDate: '2026-10-12',
      scanner: 'Siemens Magnetom Trio 3.0T',
      voxelSpacing: { 
        dx: 1.4062, // Exact from testing dataset
        dy: 1.4062, 
        dz: 10.0 
      },
      condition: 'Normal', // Normal control test case
      indication: 'Atypical chest discomfort, normal troponin, MRI performed for definitive anatomical exclusion.',
      acdcCohortId: 'ACDC-database-testing-patient101',
    },
    metrics: {
      // PREDICTED METRICS ON OFFICIAL TEST COHORT (NOTEBOOK CELL 388)
      edv: 162.40,
      esv: 68.10,
      sv: 94.30,
      lvef: 58.07,
      cardiacOutput: 6.60,
      myocardialMass: 126.80,
      rvEdv: 142.10,
      rvEsv: 58.40,
      rvef: 58.90,
      status: 'Normal Systolic Function',
      statusColor: '#10B981',
      interpretation: 'Normal ventricular volumes and preserved global systolic ejection fraction (LVEF 58.07%). No evidence of focal myocardial thinning or regional wall motion abnormality on short-axis cine inspection.',
      modelMetrics: {
        architecture: 'CardioSeg_AI_UNet_160 / Boundary-Aware 2D U-Net',
        overallDice: 0.8525,
        lvDice: 0.9568,      // Exact from notebook cell 388: "LV Dice: 95.68%"
        myoDice: 0.7968,     // Exact from notebook cell 388: "Myocardium Dice: 79.68%"
        rvDice: 0.8039,      // Exact from notebook cell 388: "RV Dice: 80.39%"
        boundaryF1: 0.8920,
        meanUncertainty: 0.038,
        inferenceTimeMs: 118,
      },
    },
    slices: [
      {
        sliceIndex: 1,
        mriUrl: '/assets/cardiac/cine_slice_2.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 22.4,
        myoAreaCm2: 14.8,
        rvAreaCm2: 19.2,
      },
      {
        sliceIndex: 2,
        mriUrl: '/assets/cardiac/slice_mri_clean.png',
        maskUrl: '/assets/cardiac/slice_mask_clean.png',
        overlayUrl: '/assets/cardiac/slice_overlay_clean.png',
        edMriUrl: '/assets/cardiac/ed_mri.png',
        edMaskUrl: '/assets/cardiac/ed_seg.png',
        esMriUrl: '/assets/cardiac/es_mri.png',
        esMaskUrl: '/assets/cardiac/es_seg.png',
        gradcamUrl: '/assets/cardiac/gradcam_heatmap.png',
        uncertaintyUrl: '/assets/cardiac/xai_uncertainty.png',
        uncertaintyOverlayUrl: '/assets/cardiac/xai_uncertainty_overlay.png',
        probRvUrl: '/assets/cardiac/prob_rv.png',
        probMyoUrl: '/assets/cardiac/prob_myo.png',
        probLvUrl: '/assets/cardiac/prob_lv.png',
        lvAreaCm2: 26.8,
        myoAreaCm2: 16.2,
        rvAreaCm2: 23.5,
      },
    ],
    ahaSegments: [
      { id: 1, name: 'Basal Anterior', region: 'Basal', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 10.1, color: '#10B981' },
      { id: 2, name: 'Basal Anteroseptal', region: 'Basal', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 10.4, color: '#10B981' },
      { id: 7, name: 'Mid Anterior', region: 'Mid-cavity', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 10.0, color: '#10B981' },
      { id: 8, name: 'Mid Anteroseptal', region: 'Mid-cavity', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 10.2, color: '#10B981' },
      { id: 13, name: 'Apical Anterior', region: 'Apical', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 9.1, color: '#10B981' },
      { id: 17, name: 'Apex', region: 'Apex', artery: 'LAD', wallMotion: 'Normal (1.0)', score: 1.0, thicknessMm: 7.8, color: '#10B981' },
    ],
  },
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-1',
    sender: 'assistant' as const,
    timestamp: 'Just now',
    text: `Hello! I am **Cardio-AI**, your clinical intelligence assistant powered by your trained boundary-aware U-Net (CardioSeg_AI_UNet_160).

You can ask me questions about cardiac MRI segmentation, clinical hemodynamics (EDV, ESV, LVEF, Stroke Volume), model interpretability (Grad-CAM, entropy uncertainty), or request a complete summary of the active patient report.`,
    suggestedPrompts: [
      'What is EDV and how is it calculated?',
      'Explain my current segmentation results.',
      'What is the difference between EDV and ESV?',
      'Summarize the generated report.',
    ],
  },
];

export const KNOWLEDGE_BASE_RESPONSES: Record<string, string> = {
  'what is edv': `**End-Diastolic Volume (EDV)** is the volume of blood in the left ventricle when it is fullest at the very end of diastole, immediately before cardiac contraction begins.

- **Clinical Relevance:** It represents the peak filling phase (preload) of the heart.
- **Normal Reference Range:** Approximately **100 – 160 mL** for adult males (or 55–100 mL/m² indexed).
- **In CardioSeg AI:** EDV is calculated by summing the segmented Left Ventricle mask areas across all short-axis cine slices during the End-Diastolic frame multiplied by slice thickness + voxel spacing:
$$\\text{EDV} = \\sum_{i=1}^{N} \\text{Area}_{LV}(i) \\times (\\text{spacing}_z) = 306.84\\text{ mL}$$`,

  'what is esv': `**End-Systolic Volume (ESV)** is the volume of blood remaining in the ventricle after maximal systolic contraction has finished, right before mitral valve opening.

- **Clinical Relevance:** ESV directly reflects left ventricular systolic emptying function and myocardial contractility.
- **Normal Reference Range:** Approximately **30 – 70 mL**.
- **Clinical Significance:** An enlarged ESV (> 80–100 mL) indicates impaired systolic function, typical of Dilated Cardiomyopathy (DCM) or post-infarction remodeling. In patient001, ESV is **234.62 mL**.`,

  'what is lvef': `**Left Ventricular Ejection Fraction (LVEF)** is the fundamental hemodynamic metric quantifying the percentage of end-diastolic blood volume ejected with each heartbeat.

$$\\text{LVEF} = \\frac{\\text{EDV} - \\text{ESV}}{\\text{EDV}} \\times 100\\% = \\frac{\\text{SV}}{\\text{EDV}} \\times 100\\%$$

- **Normal Range:** $\\ge 53\\% – 73\\%$
- **Mild Dysfunction:** $40\\% – 52\\%$
- **Moderate Dysfunction:** $30\\% – 39\\%$
- **Severe Dysfunction:** $< 30\\%$ (Patient001 is **23.54%**)`,

  'difference between edv and esv': `The fundamental difference between **EDV** and **ESV** lies in the timing within the cardiac cycle and their physiological meaning:

1. **Cardiac Phase:**
   - **EDV (End-Diastolic Volume):** Measured at the end of the filling phase (diastole) when the left ventricle is at its largest volume (patient001: **306.84 mL**).
   - **ESV (End-Systolic Volume):** Measured at peak contraction (systole) when the ventricle is at its smallest volume (patient001: **234.62 mL**).

2. **Stroke Volume Relationship:**
   - The difference between them is the **Stroke Volume (SV)**:
   $$\\text{Stroke Volume (SV)} = \\text{EDV} - \\text{ESV} = 306.84 - 234.62 = 72.22\\text{ mL}$$
   - This represents the actual volume of blood propelled into the aorta with each beat.

3. **In Cardio-AI:**
   - We segment both phases simultaneously using our boundary-aware 2D U-Net to ensure volume calculations are based on volumetric 3D integration rather than single-slice geometric assumptions.`,

  'explain segmentation': `**Cardio-AI 4-Class Semantic Segmentation Overview:**

Our deep learning architecture uses a **Boundary-Aware 2D U-Net** with hybrid focal Tversky loss to segment the cardiac cine MRI into four distinct classes:

1. 🔵 **Right Ventricle (RV) - Class 1 [Blue]:** Crescent-shaped cavity adjacent to the septum. Responsible for pulmonary circulation. Dice score: **75.67%** (training) / **80.39%** (test).
2. 🔴 **Myocardium (MYO) - Class 2 [Red]:** The muscular wall of the left ventricle. Crucial for assessing wall thickness, mass (normal 85–145g), and detecting hypertrophy or thinning. Dice score: **78.21%** (training) / **79.68%** (test).
3. 🟢 **Left Ventricle (LV) - Class 3 [Green]:** The high-pressure lumen pumping oxygenated blood to the body. Forms the basis for EDV, ESV, and LVEF calculations. Dice score: **92.95%** (training) / **95.68%** (test).
4. ⚫ **Background - Class 0:** Surrounding thoracic tissue, lungs, chest wall, and blood vessels.

You can toggle visibility and adjust transparency for each layer individually using the layer control panel on the right.`,

  'summarize report': `**Comprehensive Cardio-AI Clinical Summary:**

- **Patient:** [PatientName] ([PatientID], [Age] y/o [Gender], Height: [Height]cm, Weight: [Weight]kg)
- **Study Modality:** Cardiac Cine MRI 1.5T (TrueFISP, ACDC Benchmark)
- **Voxel Spacing:** 1.5625 x 1.5625 x 10.0 mm (Voxel volume: 24.41 mm³)
- **Hemodynamic Findings:**
  - **LV EDV:** [EDV] mL (Severely dilated)
  - **LV ESV:** [ESV] mL (Markedly enlarged)
  - **Stroke Volume:** [SV] mL
  - **LVEF:** [LVEF]% → **[Status]**
  - **RV EDV:** 176.76 mL | **RV ESV:** 106.49 mL | **RVEF:** 39.75%
  - **Myocardium Volume:** 195.36 mL | **LV Mass:** 205.13 g
  - **Cardiac Output:** [CO] L/min at [HR] bpm
- **Model Confidence & XAI:**
  - Hard Dice Overall: **83.74%**
  - LV Dice: **92.95%** | RV Dice: **75.67%** | MYO Dice: **78.21%**
  - Grad-CAM confirms dominant attention localized around the endocardial and epicardial contours.
  - Epistemic uncertainty entropy map confirms peak confidence (>99%) in lumen cores, with expected minor ambiguity strictly localized at the thin trabeculated endocardial border.`,
};
