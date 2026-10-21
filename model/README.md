# Model Directory for Cardio-AI

Place your trained model file here:
`CardioSeg_AI_160.keras` (or `CardioSeg_AI_Boundary_best.keras`)

The backend script in `backend/main.py` will automatically load this model:
```python
import tensorflow as tf
model = tf.keras.models.load_model("../model/CardioSeg_AI_160.keras", compile=False)
```

Input Shape: `(None, 160, 160, 1)` or `(None, 128, 128, 1)`
Output Shape: `(None, H, W, 4)`
Classes:
- 0: Background
- 1: Right Ventricle (RV) - Blue
- 2: Myocardium (MYO) - Red
- 3: Left Ventricle (LV) - Green
