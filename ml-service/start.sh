#!/bin/bash

# Start ML Service
# This script sets up and starts the ML service

echo "Starting ML Service..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Check if models exist
if [ ! -f "models/symptom_model.pkl" ]; then
    echo "Models not found. Training models..."
    python train_models.py
fi

# Start the service
echo "Starting ML service on http://localhost:5000"
python app.py

