"""
Flask API for ML-based symptom analysis and doctor recommendation
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from models.symptom_analyzer import SymptomAnalyzer
from models.doctor_recommender import DoctorRecommender
from models.rag_specialist_recommender import RAGSpecialistRecommender

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize models
symptom_analyzer = SymptomAnalyzer()
doctor_recommender = DoctorRecommender()
rag_specialist_recommender = RAGSpecialistRecommender()

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "models_loaded": True, "rag_loaded": True})

@app.route('/api/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    """
    Analyze symptoms and return possible conditions
    
    Request body:
    {
        "symptoms": "headache, fever, nausea"
    }
    
    Response:
    {
        "conditions": [
            {
                "name": "Migraine",
                "description": "...",
                "confidence": 0.85,
                "recommended_specialist": "Neurologist"
            },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        symptoms_text = data.get('symptoms', '')
        
        if not symptoms_text:
            return jsonify({"error": "Symptoms text is required"}), 400
        
        # Analyze symptoms
        conditions = symptom_analyzer.predict_conditions(symptoms_text)
        
        # Get doctor recommendations for each condition
        results = []
        for condition in conditions:
            rag_recommendation = rag_specialist_recommender.recommend(
                condition=condition['name'],
                symptoms=symptoms_text
            )
            specialist = rag_recommendation.get("specialization") or doctor_recommender.recommend_specialist(
                condition['name'],
                symptoms_text
            )
            results.append({
                "name": condition['name'],
                "description": condition['description'],
                "confidence": float(condition['confidence']),
                "recommended_specialist": specialist,
                "recommended_department": rag_recommendation.get("department", "General Medicine"),
                "specialist_confidence": rag_recommendation.get("confidence", 0.5),
                "specialist_evidence": rag_recommendation.get("evidence", [])
            })
        
        return jsonify({
            "conditions": results,
            "primary_recommendation": results[0] if results else None
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/recommend-doctor', methods=['POST'])
def recommend_doctor():
    """
    Recommend doctor specialization based on condition and symptoms
    
    Request body:
    {
        "condition": "Diabetes",
        "symptoms": "frequent urination, increased thirst"
    }
    
    Response:
    {
        "specialization": "Endocrinologist",
        "confidence": 0.92,
        "alternative_specializations": ["General Medicine", "Internal Medicine"]
    }
    """
    try:
        data = request.get_json()
        condition = data.get('condition', '')
        symptoms = data.get('symptoms', '')

        if not condition and not symptoms:
            return jsonify({"error": "Condition or symptoms is required"}), 400

        rag_result = rag_specialist_recommender.recommend(condition=condition, symptoms=symptoms)
        recommendation = rag_result.get("specialization") or doctor_recommender.recommend_specialist(condition, symptoms)
        alternatives = rag_result.get("alternative_specializations") or doctor_recommender.get_alternative_specialists(condition)

        return jsonify({
            "specialization": recommendation,
            "department": rag_result.get("department", "General Medicine"),
            "confidence": rag_result.get("confidence", 0.5),
            "alternative_specializations": alternatives,
            "evidence": rag_result.get("evidence", [])
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

