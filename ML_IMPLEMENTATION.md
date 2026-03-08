# ML Implementation Summary

## Overview

The SymptoCare application has been updated to replace Gemini API with real ML models for symptom analysis and doctor recommendation.

## What Changed

### 1. ML Service Created (`ml-service/`)
- **Flask API** (`app.py`) - REST API for ML predictions
- **Symptom Analyzer** (`models/symptom_analyzer.py`) - Predicts conditions from symptoms
- **Doctor Recommender** (`models/doctor_recommender.py`) - Recommends doctor specializations
- **Training Script** (`train_models.py`) - Trains models using Kaggle datasets or synthetic data

### 2. Next.js API Routes
- `/api/analyze-symptoms` - Proxies to ML service for symptom analysis
- `/api/recommend-doctor` - Proxies to ML service for doctor recommendations

### 3. Frontend Updates
- **`app/page.tsx`** - Replaced Gemini API with ML service API calls
- **`app/questionnaire/[condition]/page.tsx`** - Replaced Gemini with predefined questions
- **`lib/questionnaire-questions.ts`** - Predefined questions for common conditions

### 4. Infrastructure
- Docker support for ML service
- Environment variable configuration
- Fallback mechanisms for reliability

## Features

### Symptom Analysis
- Analyzes symptom text using ML models
- Returns top 10 possible conditions with:
  - Condition name
  - Description
  - Confidence score
  - Recommended doctor specialization

### Doctor Recommendation
- Maps conditions to appropriate specialists
- Provides primary and alternative recommendations
- Uses symptom context for better accuracy

### Rule-Based Fallback
- If ML models aren't trained, uses rule-based matching
- Ensures service always works, even without training data
- Graceful degradation

## How It Works

1. **User enters symptoms** → Frontend calls `/api/analyze-symptoms`
2. **Next.js API route** → Proxies to ML service at `http://localhost:5000`
3. **ML Service** → Analyzes symptoms using trained models or rule-based matching
4. **Response** → Returns conditions with doctor recommendations
5. **Frontend** → Displays results with recommended specialists

## Setup

See `SETUP_ML.md` for detailed setup instructions.

Quick start:
```bash
# 1. Set up ML service
cd ml-service
pip install -r requirements.txt
python train_models.py
python app.py

# 2. Configure Next.js
# Add to .env.local:
ML_SERVICE_URL=http://localhost:5000

# 3. Start Next.js
npm run dev
```

## Kaggle Integration

The training script can download datasets from Kaggle if credentials are provided:

1. Get Kaggle API credentials from https://www.kaggle.com/account
2. Create `ml-service/.env`:
   ```
   KAGGLE_USERNAME=your_username
   KAGGLE_KEY=your_api_key
   ```
3. Run `python train_models.py`

If Kaggle credentials aren't provided, the script uses synthetic training data.

## Model Architecture

### Symptom Analyzer
- **Vectorization**: TF-IDF with n-grams
- **Classifier**: Random Forest (100 trees)
- **Features**: Symptom text → Condition prediction
- **Output**: Top 10 conditions with confidence scores

### Doctor Recommender
- **Method**: Rule-based mapping + symptom analysis
- **Input**: Condition name + symptom context
- **Output**: Recommended specialization + alternatives

## API Examples

### Analyze Symptoms
```bash
curl -X POST http://localhost:5000/api/analyze-symptoms \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "headache, fever, nausea"}'
```

Response:
```json
{
  "conditions": [
    {
      "name": "Migraine",
      "description": "A headache that can cause severe throbbing pain...",
      "confidence": 0.85,
      "recommended_specialist": "Neurologist"
    },
    ...
  ],
  "primary_recommendation": {...}
}
```

### Recommend Doctor
```bash
curl -X POST http://localhost:5000/api/recommend-doctor \
  -H "Content-Type: application/json" \
  -d '{"condition": "Diabetes", "symptoms": "frequent urination"}'
```

Response:
```json
{
  "specialization": "Endocrinologist",
  "confidence": 0.92,
  "alternative_specializations": ["General Medicine", "Internal Medicine"]
}
```

## Benefits Over Gemini API

1. **Cost**: No API costs - runs locally
2. **Privacy**: Data stays on your servers
3. **Reliability**: No external API dependencies
4. **Customization**: Can train on your own datasets
5. **Speed**: Faster responses (no network latency to external API)
6. **Control**: Full control over model behavior and updates

## Next Steps

1. **Train with real data**: Use Kaggle datasets or your own medical data
2. **Improve models**: Fine-tune hyperparameters, try different algorithms
3. **Add more conditions**: Expand the condition database
4. **Enhance recommendations**: Add more context (age, gender, medical history)
5. **Deploy**: Set up production deployment for ML service

## Notes

- The chat feature (`app/chat/page.tsx`) still uses Gemini API for conversational responses. This can be kept or replaced with a simpler response system.
- Models are saved in `ml-service/models/` (gitignored)
- Training data is in `ml-service/data/` (gitignored)
- Service falls back to rule-based matching if models aren't available

