# ML Service for SymptoCare

This service provides ML-based symptom analysis and doctor recommendation.
It now includes a trained retrieval-augmented (RAG-style) model for mapping symptom text to doctor specialization and department.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Kaggle API (optional, for downloading datasets):
   - Get your Kaggle API credentials from https://www.kaggle.com/account
   - Create `.env` file with:
   ```
   KAGGLE_USERNAME=your_username
   KAGGLE_KEY=your_api_key
   ```

3. Train models (symptom classifier + doctor recommender + RAG retriever):
```bash
python train_models.py
```

4. Run the service:
```bash
python app.py
```

Or with gunicorn:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### Health Check
- `GET /health` - Check service status

### Analyze Symptoms
- `POST /api/analyze-symptoms`
- Body: `{"symptoms": "headache, fever, nausea"}`
- Returns: List of possible conditions with doctor specialization and department recommendations

### Recommend Doctor
- `POST /api/recommend-doctor`
- Body: `{"condition": "Diabetes", "symptoms": "frequent urination"}`
- Also supports symptom-only requests: `{"symptoms": "chest pain and breathlessness"}`
- Returns: Recommended doctor specialization, department, confidence, alternatives, and retrieval evidence

## Models

- **Symptom Analyzer**: Predicts possible conditions from symptom text
- **Doctor Recommender**: Recommends appropriate doctor specialization
- **RAG Specialist Recommender**: Retrieves nearest symptom-condition patterns to recommend specialization + department

Models use rule-based fallback if trained models are not available.

