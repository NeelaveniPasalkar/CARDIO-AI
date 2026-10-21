# Cardio-AI Test Cardiac MRI Samples

These 10 standalone Cardiac MRI short-axis test scans are prepared for your manual testing.
You can drag and drop or browse any of these images to test the Cardio-AI segmentation model and hemodynamic intelligence web application.

| Filename | Anatomical View / Phase | Description |
| :--- | :--- | :--- |
| **test_mri_01.png** | Cine Base (Basal SAX) | Basal short-axis slice showing LV and RV outflow tract |
| **test_mri_02.png** | Mid-Cavity | Mid-ventricular short-axis slice showing circular LV and crescent RV |
| **test_mri_03.png** | Mid-Septum | Mid-cavity short-axis slice highlighting the interventricular septum |
| **test_mri_04.png** | Mid-Apex | Lower mid-ventricular slice approaching the apex |
| **test_mri_05.png** | Apical Slice | Apical short-axis slice showing small LV cavity |
| **test_mri_06.png** | End-Diastole (ED) | Peak relaxation phase with maximum ventricular blood volume |
| **test_mri_07.png** | End-Systole (ES) | Peak contraction phase with minimum ventricular blood volume |
| **test_mri_08.png** | Standard SAX Clean | Normalized clean short-axis cardiac slice |
| **test_mri_09.png** | Cine Phase A | Dynamic contraction frame from cine cine-MRI loop |
| **test_mri_10.png** | Cine Phase B | Dynamic filling frame from cine-MRI loop |

### How to Test:
1. Open the Cardio-AI web app at `http://localhost:5173/`.
2. Drag and drop any of the `test_mri_XX.png` images from this `samples/` folder directly into the upload area on the website (or click **Click to upload** and select one).
3. The system will analyze the scan, run segmentation (RV: Blue, Myocardium: Red, LV: Green), compute volumetric metrics (EDV, ESV, LVEF, SV), and show Explainable AI (XAI) maps.
4. Click **Download PDF Report** in the top navbar to review or print the diagnostic report.
