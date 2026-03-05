from pathlib import Path
import sys

NLP_SERVICE_DIR = Path(__file__).resolve().parents[1]
if str(NLP_SERVICE_DIR) not in sys.path:
	sys.path.insert(0, str(NLP_SERVICE_DIR))
