# ML Service Setup Guide

This guide explains how to set up and use the ML-based symptom analysis and doctor recommendation system that replaces the Gemini API.

## Overview

The ML service consists of:
1. **Python Flask API** (`ml-service/`) - Backend ML service
2. **Next.js API Routes** (`app/api/`) - Frontend API integration
3. **ML Models** - Symptom analyzer and doctor recommender

## Prerequisites

- Python 3.8+
- Node.js and npm/pnpm
- Kaggle account (optional, for dataset downloads)

## Setup Steps

### 1. Set Up ML Service

```bash
cd ml-service
pip install -r requirements.txt
```

### 2. Configure Kaggle API (Optional)

If you want to download datasets from Kaggle:

1. Get your Kaggle API credentials:
   - Go to https://www.kaggle.com/account
   - Click "Create New API Token"
   - Download `kaggle.json`

2. Create `.env` file in `ml-service/`:
   ```
   KAGGLE_USERNAME=your_kaggle_username
   KAGGLE_KEY=your_kaggle_api_key
   ```

   Or set environment variables:
   ```bash
   export KAGGLE_USERNAME=your_username
   export KAGGLE_KEY=your_api_key
   ```

### 3. Train Models

Train the ML models (this will create synthetic data if Kaggle datasets are unavailable):

```bash
cd ml-service
python train_models.py
```

This will:
- Download datasets from Kaggle (if credentials are provided)
- Create synthetic training data if needed
- Train symptom analysis model
- Train doctor recommendation model
- Save models to `ml-service/models/`

### 4. Start ML Service

```bash
cd ml-service
python app.py
```

Or with gunicorn (production):
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

The service will run on `http://localhost:5000`

### 5. Configure Next.js App

Add ML service URL to your `.env.local`:

```env
ML_SERVICE_URL=http://localhost:5000
```

For production, update to your deployed ML service URL.

### 6. Start Next.js App

```bash
npm run dev
# or
pnpm dev
```

## API Endpoints

### ML Service Endpoints

- `GET /health` - Health check
- `POST /api/analyze-symptoms` - Analyze symptoms and get condition predictions
- `POST /api/recommend-doctor` - Get doctor specialization recommendation

### Next.js API Routes

- `POST /api/analyze-symptoms` - Proxy to ML service
- `POST /api/recommend-doctor` - Proxy to ML service

## Usage

### Frontend Usage

The frontend automatically uses the ML service. No code changes needed in components - they call the Next.js API routes which proxy to the ML service.

Example:
```typescript
const response = await fetch('/api/analyze-symptoms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symptoms: 'headache, fever, nausea' })
})
```

## Model Details

### Symptom Analyzer
- Uses TF-IDF vectorization and Random Forest classifier
- Predicts possible conditions from symptom text
- Falls back to rule-based matching if model not trained
- Returns top 10 conditions with confidence scores

### Doctor Recommender
- Maps conditions to appropriate doctor specializations
- Uses symptom analysis for additional context
- Returns primary and alternative specialist recommendations

## Troubleshooting

### ML Service Not Starting
- Check Python version: `python --version` (should be 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 5000 is available

### Models Not Found
- Run `python train_models.py` to train models
- Models will be saved to `ml-service/models/`
- Service will use rule-based fallback if models not found

### Kaggle API Errors
- Verify credentials in `.env` file
- Check API key is valid at https://www.kaggle.com/account
- Service will use synthetic data if Kaggle download fails

### Next.js Can't Connect to ML Service
- Verify ML service is running: `curl http://localhost:5000/health`
- Check `ML_SERVICE_URL` in `.env.local`
- Check CORS settings in `ml-service/app.py`

## Production Deployment

### ML Service
- Deploy to a server or cloud platform (AWS, GCP, Azure)
- Use gunicorn with multiple workers
- Set up environment variables
- Ensure models are deployed with the service

### Next.js
- Update `ML_SERVICE_URL` to production ML service URL
- Deploy as usual (Vercel, etc.)

## Dataset Sources

The training script can use:
- Kaggle datasets (if credentials provided)
- Synthetic data (fallback)

Recommended Kaggle datasets:
- `kaushik2897/disease-symptom-description-dataset`
- `prasad22/healthcare-dataset`

You can also provide your own dataset in CSV format with columns:
- `symptoms` - Symptom description text
- `condition` - Medical condition name

## Support

For issues or questions:
1. Check logs in ML service console
2. Verify all environment variables are set
3. Ensure models are trained and saved correctly

