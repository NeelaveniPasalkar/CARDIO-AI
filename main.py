"""
Root entrypoint for Render and cloud web services.
Exposes FastAPI application instance `app`.
"""
import sys
import os

# Add root directory to python path
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app
