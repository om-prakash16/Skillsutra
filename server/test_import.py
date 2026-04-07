import sys
import os
sys.path.append(os.getcwd())
try:
    from modules.jobs.models import JobUpdate
    print("SUCCESS: JobUpdate imported")
except ImportError as e:
    print(f"FAILURE: {e}")
except Exception as e:
    print(f"ERROR: {e}")
