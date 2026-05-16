import subprocess
import sys
import os

def run_command(command):
    print(f"Running: {command}")
    subprocess.check_call(command, shell=True)

def setup():
    # Install requirements
    run_command(f"{sys.executable} -m pip install -r requirements.txt")
    
    # Download spaCy model
    run_command(f"{sys.executable} -m spacy download en_core_web_sm")
    
    # Train the ML model
    from ml_engine import train_model
    train_model()
    
    print("\nBackend setup complete!")

if __name__ == "__main__":
    setup()
