"""
RAG-style specialist recommender based on symptom retrieval.
"""
import json
import os
import re
from typing import Dict, List

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


class RAGSpecialistRecommender:
    """Retrieval-based recommender for specialist and department prediction."""

    def __init__(self):
        self.vectorizer = None
        self.document_matrix = None
        self.documents: List[Dict] = []

        self.models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
        self.vectorizer_path = os.path.join(self.models_dir, "rag_specialist_vectorizer.pkl")
        self.matrix_path = os.path.join(self.models_dir, "rag_specialist_matrix.pkl")
        self.documents_path = os.path.join(self.models_dir, "rag_specialist_documents.json")

        self._load_or_bootstrap()

    def _load_or_bootstrap(self):
        """Load trained artifacts; bootstrap from default KB if artifacts are absent."""
        try:
            if (
                os.path.exists(self.vectorizer_path)
                and os.path.exists(self.matrix_path)
                and os.path.exists(self.documents_path)
            ):
                self.vectorizer = joblib.load(self.vectorizer_path)
                self.document_matrix = joblib.load(self.matrix_path)
                with open(self.documents_path, "r", encoding="utf-8") as file:
                    self.documents = json.load(file)
                print("Loaded trained RAG specialist recommender")
                return
        except Exception as error:
            print(f"Failed to load RAG artifacts: {error}. Falling back to default KB.")

        self.documents = self._default_documents()
        self._fit_from_documents(self.documents)
        print("Using bootstrap RAG specialist recommender (default KB)")

    def _fit_from_documents(self, documents: List[Dict]):
        texts = [doc["text"] for doc in documents]
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        self.document_matrix = self.vectorizer.fit_transform(texts)

    def _normalize_text(self, text: str) -> str:
        return re.sub(r"\s+", " ", (text or "").strip().lower())

    def _extract_keywords(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^a-zA-Z0-9\s]", " ", self._normalize_text(text))
        return [token for token in cleaned.split(" ") if len(token) > 2]

    def _default_documents(self) -> List[Dict]:
        entries = [
            ("chest pain pressure shortness of breath palpitations dizziness", "Cardiologist", "Cardiology", "Heart Disease"),
            ("high blood pressure severe headache dizziness blurred vision", "Cardiologist", "Cardiology", "Hypertension"),
            ("persistent cough wheezing breathing difficulty chest tightness", "Pulmonologist", "Pulmonology", "Asthma"),
            ("fever cough chest pain breathlessness sputum", "Pulmonologist", "Pulmonology", "Pneumonia"),
            ("runny nose sneezing sore throat mild fever congestion", "General Physician", "General Medicine", "Common Cold"),
            ("high fever body ache chills fatigue dry cough", "General Physician", "General Medicine", "Viral Fever"),
            ("throbbing headache light sensitivity nausea aura", "Neurologist", "Neurology", "Migraine"),
            ("seizure blackout confusion memory loss tremor", "Neurologist", "Neurology", "Neurological Disorder"),
            ("abdominal pain acidity bloating nausea vomiting indigestion", "Gastroenterologist", "Gastroenterology", "Gastritis"),
            ("diarrhea vomiting dehydration stomach cramps", "Gastroenterologist", "Gastroenterology", "Gastroenteritis"),
            ("jaundice abdominal swelling liver pain appetite loss", "Hepatologist", "Hepatology", "Liver Disorder"),
            ("frequent urination excessive thirst sudden weight loss fatigue", "Endocrinologist", "Endocrinology", "Diabetes"),
            ("thyroid swelling neck weight gain hair loss cold intolerance", "Endocrinologist", "Endocrinology", "Thyroid Disorder"),
            ("joint pain morning stiffness swelling reduced movement", "Rheumatologist", "Rheumatology", "Arthritis"),
            ("bone fracture injury trauma severe limb pain", "Orthopedic Surgeon", "Orthopedics", "Orthopedic Injury"),
            ("skin rash itching redness eczema acne hives", "Dermatologist", "Dermatology", "Skin Disorder"),
            ("anxiety panic restlessness sleep disturbance palpitations", "Psychiatrist", "Psychiatry", "Anxiety Disorder"),
            ("persistent sadness low mood hopelessness loss of interest", "Psychiatrist", "Psychiatry", "Depression"),
            ("burning urination flank pain blood in urine fever", "Urologist", "Urology", "Urinary Tract Disorder"),
            ("irregular periods pelvic pain infertility hormonal imbalance", "Gynecologist", "Gynecology", "Gynecological Disorder"),
            ("ear pain hearing loss ringing dizziness sinus throat pain", "ENT Specialist", "ENT", "ENT Disorder"),
            ("blurred vision eye pain redness watering discharge", "Ophthalmologist", "Ophthalmology", "Eye Disorder"),
            ("swelling legs reduced urine frothy urine fatigue", "Nephrologist", "Nephrology", "Kidney Disease"),
            ("tooth pain gum swelling bleeding bad breath", "Dentist", "Dental", "Dental Disorder"),
            ("child fever cough poor feeding vomiting rash", "Pediatrician", "Pediatrics", "Pediatric Illness"),
            ("chronic fatigue pale skin weakness breathlessness", "Hematologist", "Hematology", "Anemia"),
            ("allergic sneezing itchy eyes rash wheals swelling", "Allergist", "Allergy and Immunology", "Allergy"),
        ]

        return [
            {
                "condition": condition,
                "specialization": specialization,
                "department": department,
                "text": f"{condition} {symptoms} {specialization} {department}",
                "symptoms": symptoms,
            }
            for symptoms, specialization, department, condition in entries
        ]

    def recommend(self, condition: str = "", symptoms: str = "", top_k: int = 5) -> Dict:
        """
        Retrieve the most relevant specialist and department from symptom text.
        """
        query = self._normalize_text(f"{condition} {symptoms}")
        if not query:
            return {
                "specialization": "General Physician",
                "department": "General Medicine",
                "confidence": 0.0,
                "alternative_specializations": ["Internal Medicine", "Family Medicine"],
                "evidence": [],
            }

        query_vector = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vector, self.document_matrix).flatten()

        top_indices = similarities.argsort()[::-1][: max(top_k, 1)]
        evidence = []
        aggregate_scores: Dict[str, float] = {}

        query_keywords = set(self._extract_keywords(query))
        for index in top_indices:
            score = float(similarities[index])
            if score <= 0:
                continue
            doc = self.documents[int(index)]
            key = f"{doc['specialization']}|{doc['department']}"
            aggregate_scores[key] = aggregate_scores.get(key, 0.0) + score

            doc_keywords = set(self._extract_keywords(doc.get("symptoms", "")))
            matched_terms = sorted(query_keywords.intersection(doc_keywords))[:8]
            evidence.append(
                {
                    "condition": doc["condition"],
                    "specialization": doc["specialization"],
                    "department": doc["department"],
                    "similarity": round(score, 4),
                    "matched_terms": matched_terms,
                }
            )

        if not aggregate_scores:
            return {
                "specialization": "General Physician",
                "department": "General Medicine",
                "confidence": 0.35,
                "alternative_specializations": ["Internal Medicine", "Family Medicine"],
                "evidence": [],
            }

        ranked = sorted(aggregate_scores.items(), key=lambda item: item[1], reverse=True)
        primary_key, primary_score = ranked[0]
        primary_specialization, primary_department = primary_key.split("|", 1)

        alternatives = []
        for key, _ in ranked[1:4]:
            specialization, _department = key.split("|", 1)
            if specialization != primary_specialization:
                alternatives.append(specialization)

        if not alternatives:
            alternatives = ["General Physician", "Internal Medicine"]

        confidence = min(0.99, max(0.35, primary_score))
        return {
            "specialization": primary_specialization,
            "department": primary_department,
            "confidence": round(confidence, 2),
            "alternative_specializations": alternatives[:3],
            "evidence": evidence[:3],
        }
