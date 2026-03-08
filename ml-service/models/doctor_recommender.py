"""
Doctor Recommender Model - Recommends doctor specialization based on condition
"""
import joblib
import os
from typing import List, Dict

class DoctorRecommender:
    """Recommends appropriate doctor specialization based on condition"""
    
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'doctor_recommender.pkl')
        
        # Condition to specialization mapping
        self.condition_to_specialist = {
            "Diabetes": "Endocrinologist",
            "Hypertension": "Cardiologist",
            "Asthma": "Pulmonologist",
            "Common Cold": "General Medicine",
            "Migraine": "Neurologist",
            "Anemia": "Hematologist",
            "Allergy": "Allergist",
            "Bronchitis": "Pulmonologist",
            "Flu": "General Medicine",
            "Gastroenteritis": "Gastroenterologist",
            "Pneumonia": "Pulmonologist",
            "Arthritis": "Rheumatologist",
            "Depression": "Psychiatrist",
            "Anxiety": "Psychiatrist",
            "COPD": "Pulmonologist",
            "Heart Disease": "Cardiologist",
            "Kidney Disease": "Nephrologist",
            "Liver Disease": "Hepatologist",
            "Thyroid Disorder": "Endocrinologist",
            "Osteoporosis": "Orthopedist",
            "General Consultation": "General Medicine"
        }
        
        # Alternative specialists for each condition
        self.alternative_specialists = {
            "Diabetes": ["General Medicine", "Internal Medicine"],
            "Hypertension": ["General Medicine", "Internal Medicine"],
            "Asthma": ["General Medicine", "Allergist"],
            "Common Cold": ["General Medicine", "Family Medicine"],
            "Migraine": ["General Medicine", "Pain Specialist"],
            "Anemia": ["General Medicine", "Internal Medicine"],
            "Allergy": ["General Medicine", "Dermatologist"],
            "Bronchitis": ["General Medicine", "Internal Medicine"],
            "Flu": ["General Medicine", "Family Medicine"],
            "Gastroenteritis": ["General Medicine", "Internal Medicine"],
            "Pneumonia": ["General Medicine", "Infectious Disease Specialist"],
            "Arthritis": ["General Medicine", "Orthopedist"],
            "Depression": ["General Medicine", "Psychologist"],
            "Anxiety": ["General Medicine", "Psychologist"],
            "COPD": ["General Medicine", "Internal Medicine"],
            "Heart Disease": ["General Medicine", "Internal Medicine"],
            "Kidney Disease": ["General Medicine", "Internal Medicine"],
            "Liver Disease": ["General Medicine", "Gastroenterologist"],
            "Thyroid Disorder": ["General Medicine", "Internal Medicine"],
            "Osteoporosis": ["General Medicine", "Rheumatologist"]
        }
        
        # Symptom-based specialist recommendations
        self.symptom_to_specialist = {
            "chest pain": "Cardiologist",
            "heart": "Cardiologist",
            "breathing": "Pulmonologist",
            "cough": "Pulmonologist",
            "lung": "Pulmonologist",
            "headache": "Neurologist",
            "seizure": "Neurologist",
            "brain": "Neurologist",
            "joint": "Rheumatologist",
            "bone": "Orthopedist",
            "fracture": "Orthopedist",
            "skin": "Dermatologist",
            "rash": "Dermatologist",
            "stomach": "Gastroenterologist",
            "digestive": "Gastroenterologist",
            "nausea": "Gastroenterologist",
            "diarrhea": "Gastroenterologist",
            "kidney": "Nephrologist",
            "urination": "Urologist",
            "mental": "Psychiatrist",
            "depression": "Psychiatrist",
            "anxiety": "Psychiatrist",
            "diabetes": "Endocrinologist",
            "thyroid": "Endocrinologist",
            "hormone": "Endocrinologist",
            "eye": "Ophthalmologist",
            "vision": "Ophthalmologist",
            "ear": "ENT Specialist",
            "nose": "ENT Specialist",
            "throat": "ENT Specialist"
        }
        
        self._load_model()
    
    def _load_model(self):
        """Load trained model if it exists"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print("Loaded trained doctor recommender model")
            else:
                print("Using rule-based doctor recommendation")
        except Exception as e:
            print(f"Error loading model: {e}. Using rule-based fallback.")
    
    def recommend_specialist(self, condition: str, symptoms: str = "") -> str:
        """
        Recommend doctor specialization based on condition and symptoms
        
        Args:
            condition: Medical condition name
            symptoms: Additional symptom text for context
            
        Returns:
            Recommended doctor specialization
        """
        # First, try condition-based mapping
        if condition in self.condition_to_specialist:
            return self.condition_to_specialist[condition]
        
        # If condition not found, analyze symptoms
        if symptoms:
            symptoms_lower = symptoms.lower()
            for symptom_keyword, specialist in self.symptom_to_specialist.items():
                if symptom_keyword in symptoms_lower:
                    return specialist
        
        # Default to General Medicine
        return "General Medicine"
    
    def get_alternative_specialists(self, condition: str) -> List[str]:
        """
        Get alternative specialist recommendations
        
        Args:
            condition: Medical condition name
            
        Returns:
            List of alternative specializations
        """
        if condition in self.alternative_specialists:
            return self.alternative_specialists[condition]
        
        return ["General Medicine", "Internal Medicine"]
    
    def get_all_specialists_for_condition(self, condition: str, symptoms: str = "") -> Dict[str, List[str]]:
        """
        Get all specialist recommendations (primary and alternatives)
        
        Args:
            condition: Medical condition name
            symptoms: Additional symptom text
            
        Returns:
            Dictionary with primary and alternative specialists
        """
        primary = self.recommend_specialist(condition, symptoms)
        alternatives = self.get_alternative_specialists(condition)
        
        # Remove primary from alternatives if present
        alternatives = [alt for alt in alternatives if alt != primary]
        
        return {
            "primary": primary,
            "alternatives": alternatives[:3]  # Limit to top 3 alternatives
        }

