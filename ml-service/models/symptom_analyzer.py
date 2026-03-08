"""
Symptom Analyzer Model - Predicts possible conditions from symptoms
"""
import joblib
import os
import re
from typing import List, Dict
import numpy as np

class SymptomAnalyzer:
    """Analyzes symptoms and predicts possible medical conditions"""
    
    def __init__(self):
        self.model = None
        self.vectorizer = None
        self.condition_mapping = {}
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'symptom_model.pkl')
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'symptom_vectorizer.pkl')
        self.mapping_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'condition_mapping.json')
        
        # Load models if they exist, otherwise use rule-based fallback
        self._load_models()
        
        # Condition descriptions
        self.condition_descriptions = {
            "Diabetes": "A chronic condition that affects how your body processes blood sugar (glucose).",
            "Hypertension": "High blood pressure that can lead to serious health problems if left untreated.",
            "Asthma": "A condition in which your airways narrow and swell, causing breathing difficulties.",
            "Common Cold": "A viral infection of your nose and throat.",
            "Migraine": "A headache that can cause severe throbbing pain or a pulsing sensation.",
            "Anemia": "A condition where you lack enough healthy red blood cells to carry adequate oxygen.",
            "Allergy": "An immune system reaction to a foreign substance.",
            "Bronchitis": "Inflammation of the lining of your bronchial tubes.",
            "Flu": "A contagious respiratory illness caused by influenza viruses.",
            "Gastroenteritis": "Inflammation of the stomach and intestines causing vomiting and diarrhea.",
            "Pneumonia": "Infection that inflames air sacs in one or both lungs.",
            "Arthritis": "Inflammation of one or more joints causing pain and stiffness.",
            "Depression": "A mood disorder causing persistent feelings of sadness and loss of interest.",
            "Anxiety": "A mental health disorder characterized by feelings of worry or fear.",
            "COPD": "Chronic Obstructive Pulmonary Disease - a group of lung diseases.",
            "Heart Disease": "A range of conditions affecting your heart.",
            "Kidney Disease": "A condition in which kidneys lose their ability to filter waste.",
            "Liver Disease": "Any condition that affects the liver's ability to function properly.",
            "Thyroid Disorder": "Conditions affecting the thyroid gland's hormone production.",
            "Osteoporosis": "A condition that weakens bones, making them fragile and more likely to break."
        }
        
        # Symptom-to-condition mapping (rule-based fallback)
        self.symptom_keywords = {
            "Diabetes": ["thirst", "urination", "hunger", "fatigue", "blurred vision", "slow healing", "weight loss"],
            "Hypertension": ["headache", "dizziness", "chest pain", "shortness of breath", "nosebleed"],
            "Asthma": ["wheezing", "shortness of breath", "chest tightness", "coughing", "breathing difficulty"],
            "Common Cold": ["runny nose", "sneezing", "cough", "sore throat", "congestion", "mild fever"],
            "Migraine": ["headache", "throbbing", "sensitivity to light", "nausea", "vomiting", "aura"],
            "Anemia": ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands"],
            "Allergy": ["sneezing", "runny nose", "itchy eyes", "rash", "hives", "swelling"],
            "Bronchitis": ["cough", "mucus", "fatigue", "shortness of breath", "chest discomfort", "fever"],
            "Flu": ["fever", "chills", "muscle aches", "fatigue", "cough", "headache", "sore throat"],
            "Gastroenteritis": ["nausea", "vomiting", "diarrhea", "stomach pain", "fever", "dehydration"],
            "Pneumonia": ["cough", "fever", "chills", "shortness of breath", "chest pain", "fatigue"],
            "Arthritis": ["joint pain", "stiffness", "swelling", "reduced range of motion", "redness"],
            "Depression": ["sadness", "loss of interest", "fatigue", "sleep problems", "appetite changes"],
            "Anxiety": ["worry", "restlessness", "fatigue", "difficulty concentrating", "irritability", "sleep problems"],
            "COPD": ["shortness of breath", "wheezing", "chest tightness", "chronic cough", "mucus"],
            "Heart Disease": ["chest pain", "shortness of breath", "fatigue", "irregular heartbeat", "dizziness"],
            "Kidney Disease": ["fatigue", "swelling", "urination changes", "nausea", "shortness of breath"],
            "Liver Disease": ["fatigue", "jaundice", "abdominal pain", "nausea", "dark urine", "swelling"],
            "Thyroid Disorder": ["fatigue", "weight changes", "mood changes", "hair loss", "temperature sensitivity"],
            "Osteoporosis": ["back pain", "loss of height", "stooped posture", "bone fractures"]
        }
    
    def _load_models(self):
        """Load trained models if they exist"""
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                print("Loaded trained ML models")
            else:
                print("Using rule-based symptom analysis (models not trained yet)")
        except Exception as e:
            print(f"Error loading models: {e}. Using rule-based fallback.")
    
    def _extract_symptoms(self, text: str) -> List[str]:
        """Extract symptom keywords from text"""
        text_lower = text.lower()
        symptoms = []
        
        # Common symptom patterns
        symptom_patterns = [
            r'\b(headache|head ache)\b',
            r'\b(fever|high temperature)\b',
            r'\b(cough|coughing)\b',
            r'\b(nausea|nauseous)\b',
            r'\b(vomiting|vomit|throwing up)\b',
            r'\b(diarrhea|diarrhoea)\b',
            r'\b(fatigue|tired|exhausted)\b',
            r'\b(shortness of breath|breathing difficulty|difficulty breathing)\b',
            r'\b(chest pain|chest discomfort)\b',
            r'\b(dizziness|dizzy)\b',
            r'\b(pain|aching|sore)\b',
            r'\b(rash|skin irritation)\b',
            r'\b(swelling|swollen)\b',
            r'\b(joint pain|joint stiffness)\b',
            r'\b(thirst|thirsty)\b',
            r'\b(frequent urination|urination)\b',
            r'\b(weight loss|weight gain)\b',
            r'\b(sneezing|sneeze)\b',
            r'\b(runny nose|nasal congestion)\b',
            r'\b(sore throat|throat pain)\b'
        ]
        
        for pattern in symptom_patterns:
            if re.search(pattern, text_lower):
                symptoms.append(pattern.replace(r'\b', '').replace('(', '').replace(')', '').split('|')[0])
        
        return symptoms
    
    def predict_conditions(self, symptoms_text: str, top_n: int = 10) -> List[Dict]:
        """
        Predict possible conditions from symptoms text
        
        Args:
            symptoms_text: Text description of symptoms
            top_n: Number of top conditions to return
            
        Returns:
            List of condition dictionaries with name, description, and confidence
        """
        symptoms_text_lower = symptoms_text.lower()
        condition_scores = {}
        
        # If model is loaded, use it
        if self.model and self.vectorizer:
            try:
                # Vectorize symptoms
                symptoms_vector = self.vectorizer.transform([symptoms_text])
                # Predict probabilities
                probabilities = self.model.predict_proba(symptoms_vector)[0]
                
                # Get condition names from model
                if hasattr(self.model, 'classes_'):
                    for i, condition in enumerate(self.model.classes_):
                        condition_scores[condition] = float(probabilities[i])
            except Exception as e:
                print(f"Error using ML model: {e}. Falling back to rule-based.")
        
        # Rule-based scoring (fallback or supplement)
        for condition, keywords in self.symptom_keywords.items():
            score = 0
            matches = 0
            for keyword in keywords:
                if keyword.lower() in symptoms_text_lower:
                    matches += 1
                    score += 1.0 / len(keywords)  # Normalize by number of keywords
            
            # Boost score if multiple keywords match
            if matches > 0:
                score = min(score * (1 + matches * 0.2), 1.0)  # Cap at 1.0
                if condition in condition_scores:
                    condition_scores[condition] = max(condition_scores[condition], score)
                else:
                    condition_scores[condition] = score
        
        # Sort by score and get top N
        sorted_conditions = sorted(
            condition_scores.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:top_n]
        
        # Format results
        results = []
        for condition, confidence in sorted_conditions:
            results.append({
                "name": condition,
                "description": self.condition_descriptions.get(
                    condition, 
                    f"A medical condition related to the described symptoms."
                ),
                "confidence": round(confidence, 2)
            })
        
        # If no matches, return common conditions
        if not results:
            results = [
                {
                    "name": "General Consultation",
                    "description": "Please consult with a healthcare professional for proper diagnosis.",
                    "confidence": 0.5
                }
            ]
        
        return results

