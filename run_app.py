"""
AI Retail Stock Intelligence: Sell It, Move It, or Save It
Application Launcher
"""

import sys
import subprocess
import uvicorn
import webbrowser
import threading
import time

def open_browser():
    time.sleep(1.5)
    print("\n[+] Opening browser at http://localhost:8000 ...")
    webbrowser.open("http://localhost:8000")

def main():
    print("=" * 70)
    print("  AI Retail Stock Intelligence: Sell It, Move It, or Save It")
    print("  10-Agent Architecture | Google Gemini & Vertex AI ADK Pattern")
    print("=" * 70)
    print("\nStarting unified FastAPI & React application server on http://localhost:8000 ...")
    
    # Open browser automatically
    threading.Thread(target=open_browser, daemon=True).start()
    
    # Run uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False)

if __name__ == "__main__":
    main()
