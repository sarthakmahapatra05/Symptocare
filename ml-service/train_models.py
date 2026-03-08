"""
Training script for ML models
Downloads datasets from Kaggle and trains models
"""
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import joblib
import json
from dotenv import load_dotenv
from models.rag_specialist_recommender import RAGSpecialistRecommender

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
LOCAL_DATASET_DIR = os.path.join(PROJECT_ROOT, "public", "csvfiles")

def read_csv_flexible(path: str, **kwargs):
    """Read CSV with common fallback encodings."""
    encodings = ["utf-8", "utf-8-sig", "latin1", "cp1252"]
    last_error = None
    for encoding in encodings:
        try:
            return pd.read_csv(path, encoding=encoding, **kwargs)
        except Exception as error:
            last_error = error
    raise last_error

def find_local_dataset_path(file_name: str):
    candidate = os.path.join(LOCAL_DATASET_DIR, file_name)
    return candidate if os.path.exists(candidate) else None

def normalize_text(value: str) -> str:
    return " ".join(str(value).replace("_", " ").strip().split())

def infer_department_from_specialization(specialization: str) -> str:
    spec = specialization.lower()
    mapping = {
        "cardio": "Cardiology",
        "dermat": "Dermatology",
        "endocr": "Endocrinology",
        "gastro": "Gastroenterology",
        "neuro": "Neurology",
        "nephro": "Nephrology",
        "ortho": "Orthopedics",
        "pedia": "Pediatrics",
        "psych": "Psychiatry",
        "pulmo": "Pulmonology",
        "rheuma": "Rheumatology",
        "urolog": "Urology",
        "hepato": "Hepatology",
        "allerg": "Allergy and Immunology",
        "ent": "ENT",
        "ophthal": "Ophthalmology",
        "general": "General Medicine",
    }
    for key, department in mapping.items():
        if key in spec:
            return department
    return "General Medicine"

def load_local_symptom_dataset():
    """Build symptom->disease training rows from local CSV files."""
    original_path = find_local_dataset_path("Original_Dataset.csv")
    if not original_path:
        return None

    df = read_csv_flexible(original_path)
    disease_col = "Disease" if "Disease" in df.columns else df.columns[0]
    symptom_cols = [col for col in df.columns if str(col).lower().startswith("symptom")]
    if not symptom_cols:
        symptom_cols = [col for col in df.columns if col != disease_col]

    rows = []
    for _, row in df.iterrows():
        disease = normalize_text(row.get(disease_col, ""))
        if not disease:
            continue

        symptoms = []
        for col in symptom_cols:
            value = row.get(col)
            if pd.notna(value):
                normalized = normalize_text(value)
                if normalized:
                    symptoms.append(normalized)

        if symptoms:
            rows.append({"symptoms": " ".join(symptoms), "condition": disease})

    if not rows:
        return None

    return pd.DataFrame(rows)

def load_local_doctor_mapping():
    """Load disease->specialist pairs from local CSV."""
    mapping_path = find_local_dataset_path("Doctor_Versus_Disease.csv")
    if not mapping_path:
        return None

    df = read_csv_flexible(mapping_path, header=None)
    if df.shape[1] < 2:
        return None

    df = df.iloc[:, :2].copy()
    df.columns = ["condition", "specialist"]
    df["condition"] = df["condition"].apply(normalize_text)
    df["specialist"] = df["specialist"].apply(normalize_text)
    df = df[(df["condition"] != "") & (df["specialist"] != "")]
    df = df.drop_duplicates()
    return df if not df.empty else None

def load_local_disease_descriptions():
    """Load disease descriptions when available."""
    description_path = find_local_dataset_path("Disease_Description.csv")
    if not description_path:
        return {}

    df = read_csv_flexible(description_path)
    if "Disease" not in df.columns or "Description" not in df.columns:
        return {}

    result = {}
    for _, row in df.iterrows():
        disease = normalize_text(row.get("Disease", ""))
        description = str(row.get("Description", "")).strip()
        if disease and description:
            result[disease] = description
    return result

def download_kaggle_dataset(dataset_name: str, download_path: str):
    """Download dataset from Kaggle"""
    try:
        from kaggle.api.kaggle_api_extended import KaggleApi
        api = KaggleApi()
        api.authenticate()
        
        print(f"Downloading dataset: {dataset_name}")
        api.dataset_download_files(dataset_name, path=download_path, unzip=True)
        print(f"Dataset downloaded successfully to {download_path}")
        return True
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("Make sure KAGGLE_USERNAME and KAGGLE_KEY are set in .env file")
        return False

def create_synthetic_dataset():
    """Create synthetic dataset if Kaggle download fails"""
    print("Creating synthetic training dataset...")
    
    # Symptom-condition mappings
    data = []
    
    # Diabetes
    diabetes_symptoms = [
        "frequent urination increased thirst excessive hunger fatigue blurred vision slow healing",
        "thirst urination weight loss fatigue",
        "urination thirst hunger vision problems"
    ]
    for symptoms in diabetes_symptoms:
        data.append({"symptoms": symptoms, "condition": "Diabetes"})
    
    # Hypertension
    hypertension_symptoms = [
        "headache dizziness chest pain shortness of breath nosebleed",
        "headache dizziness fatigue vision problems",
        "chest pain shortness of breath fatigue"
    ]
    for symptoms in hypertension_symptoms:
        data.append({"symptoms": symptoms, "condition": "Hypertension"})
    
    # Asthma
    asthma_symptoms = [
        "wheezing shortness of breath chest tightness coughing",
        "breathing difficulty wheezing coughing",
        "shortness of breath chest tightness wheezing"
    ]
    for symptoms in asthma_symptoms:
        data.append({"symptoms": symptoms, "condition": "Asthma"})
    
    # Common Cold
    cold_symptoms = [
        "runny nose sneezing coughing sore throat congestion mild fever",
        "sneezing runny nose coughing congestion",
        "sore throat runny nose coughing sneezing"
    ]
    for symptoms in cold_symptoms:
        data.append({"symptoms": symptoms, "condition": "Common Cold"})
    
    # Migraine
    migraine_symptoms = [
        "headache throbbing sensitivity to light nausea vomiting",
        "severe headache nausea sensitivity to light",
        "throbbing headache nausea vomiting"
    ]
    for symptoms in migraine_symptoms:
        data.append({"symptoms": symptoms, "condition": "Migraine"})
    
    # Add more conditions...
    conditions_data = {
        "Anemia": ["fatigue weakness pale skin shortness of breath dizziness"],
        "Allergy": ["sneezing runny nose itchy eyes rash hives"],
        "Bronchitis": ["cough mucus fatigue shortness of breath chest discomfort"],
        "Flu": ["fever chills muscle aches fatigue cough headache"],
        "Gastroenteritis": ["nausea vomiting diarrhea stomach pain fever"],
        "Pneumonia": ["cough fever chills shortness of breath chest pain"],
        "Arthritis": ["joint pain stiffness swelling reduced range of motion"],
        "Depression": ["sadness loss of interest fatigue sleep problems"],
        "Anxiety": ["worry restlessness fatigue difficulty concentrating"],
        "COPD": ["shortness of breath wheezing chest tightness chronic cough"],
        "Heart Disease": ["chest pain shortness of breath fatigue irregular heartbeat"],
        "Kidney Disease": ["fatigue swelling urination changes nausea"],
        "Liver Disease": ["fatigue jaundice abdominal pain nausea"],
        "Thyroid Disorder": ["fatigue weight changes mood changes hair loss"],
        "Osteoporosis": ["back pain loss of height stooped posture"]
    }
    
    for condition, symptom_list in conditions_data.items():
        for symptoms in symptom_list:
            data.append({"symptoms": symptoms, "condition": condition})
    
    # Create variations
    augmented_data = []
    for item in data:
        augmented_data.append(item)
        # Add variations
        words = item["symptoms"].split()
        if len(words) > 3:
            # Create partial symptom sets
            for i in range(2, len(words)):
                augmented_data.append({
                    "symptoms": " ".join(words[:i]),
                    "condition": item["condition"]
                })
    
    return pd.DataFrame(augmented_data)

def train_symptom_model():
    """Train symptom analysis model"""
    print("Training symptom analysis model...")

    # 1) Prefer local datasets from public/csvfiles
    df = load_local_symptom_dataset()
    if df is not None:
        print(f"Loaded local symptom dataset from {LOCAL_DATASET_DIR} ({len(df)} rows)")
    else:
        # 2) Try Kaggle datasets
        dataset_path = "data"
        os.makedirs(dataset_path, exist_ok=True)

        datasets_to_try = [
            "kaushik2897/disease-symptom-description-dataset",
            "prasad22/healthcare-dataset",
        ]

        for dataset_name in datasets_to_try:
            if download_kaggle_dataset(dataset_name, dataset_path):
                for file in os.listdir(dataset_path):
                    if not file.endswith('.csv'):
                        continue
                    try:
                        candidate_df = pd.read_csv(os.path.join(dataset_path, file))
                        if candidate_df is not None and not candidate_df.empty:
                            df = candidate_df
                            print(f"Loaded Kaggle dataset from {file}")
                            break
                    except Exception:
                        continue
            if df is not None:
                break

        # 3) Normalize common Kaggle column names
        if df is not None and ('symptoms' not in df.columns or 'condition' not in df.columns):
            column_mapping = {
                'Symptom': 'symptoms',
                'Disease': 'condition',
                'Description': 'symptoms',
                'Disease_Name': 'condition'
            }
            for old_col, new_col in column_mapping.items():
                if old_col in df.columns:
                    df = df.rename(columns={old_col: new_col})

        # 4) Final fallback
        if df is None or 'symptoms' not in df.columns or 'condition' not in df.columns:
            print("Using synthetic dataset for symptom training...")
            df = create_synthetic_dataset()
    
    X = df['symptoms'].fillna('')
    y = df['condition'].fillna('Unknown')
    
    # Vectorize symptoms
    vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
    X_vectorized = vectorizer.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_vectorized, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Train model
    print("Training Random Forest classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "symptom_model.pkl")
    vectorizer_path = os.path.join(models_dir, "symptom_vectorizer.pkl")
    
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    print(f"\nModel saved to {model_path}")
    print(f"Vectorizer saved to {vectorizer_path}")
    
    return model, vectorizer

def train_doctor_recommender():
    """Train doctor recommendation model"""
    print("Training doctor recommender model...")

    # 1) Prefer local disease-specialist mapping
    df = load_local_doctor_mapping()
    if df is not None:
        print(f"Loaded local doctor mapping from {LOCAL_DATASET_DIR} ({len(df)} rows)")
    else:
        # 2) Fallback to built-in mapping
        from models.doctor_recommender import DoctorRecommender
        recommender = DoctorRecommender()
        data = []
        for condition, specialist in recommender.condition_to_specialist.items():
            data.append({
                "condition": condition,
                "specialist": specialist
            })
        df = pd.DataFrame(data)
    
    # Vectorize conditions
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(df['condition'])
    y = df['specialist']
    
    # Train model
    model = LogisticRegression(random_state=42, max_iter=1000)
    model.fit(X, y)
    
    # Save model
    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, "doctor_recommender.pkl")
    joblib.dump(model, model_path)
    
    print(f"Doctor recommender model saved to {model_path}")
    
    return model

def build_rag_documents_from_local():
    symptom_df = load_local_symptom_dataset()
    if symptom_df is None or symptom_df.empty:
        return None

    doctor_df = load_local_doctor_mapping()
    description_map = load_local_disease_descriptions()
    doctor_map = {}
    if doctor_df is not None and not doctor_df.empty:
        doctor_map = dict(zip(doctor_df["condition"], doctor_df["specialist"]))

    documents = []
    grouped = symptom_df.groupby("condition")["symptoms"].apply(list).to_dict()
    for condition, symptom_texts in grouped.items():
        merged_symptoms = " ".join(symptom_texts)
        specialization = doctor_map.get(condition, "General Physician")
        department = infer_department_from_specialization(specialization)
        description = description_map.get(condition, "")
        documents.append({
            "condition": condition,
            "specialization": specialization,
            "department": department,
            "symptoms": merged_symptoms,
            "text": f"{condition} {description} {merged_symptoms} {specialization} {department}",
        })

    return documents if documents else None

def train_rag_specialist_recommender():
    """Train and persist the retrieval index for specialist/department suggestions."""
    print("Training RAG specialist recommender...")
    recommender = RAGSpecialistRecommender()

    models_dir = "models"
    os.makedirs(models_dir, exist_ok=True)

    documents = build_rag_documents_from_local()
    if documents is not None:
        print(f"Loaded local RAG documents from {LOCAL_DATASET_DIR} ({len(documents)} conditions)")
    else:
        documents = recommender._default_documents()
        print("Using default RAG documents (local dataset unavailable)")
    texts = [doc["text"] for doc in documents]

    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
    matrix = vectorizer.fit_transform(texts)

    vectorizer_path = os.path.join(models_dir, "rag_specialist_vectorizer.pkl")
    matrix_path = os.path.join(models_dir, "rag_specialist_matrix.pkl")
    documents_path = os.path.join(models_dir, "rag_specialist_documents.json")

    joblib.dump(vectorizer, vectorizer_path)
    joblib.dump(matrix, matrix_path)
    with open(documents_path, "w", encoding="utf-8") as file:
        json.dump(documents, file, indent=2)

    print(f"RAG vectorizer saved to {vectorizer_path}")
    print(f"RAG matrix saved to {matrix_path}")
    print(f"RAG documents saved to {documents_path}")

    return vectorizer, matrix

if __name__ == "__main__":
    print("Starting model training...")
    print("=" * 50)
    
    # Train symptom analyzer
    symptom_model, vectorizer = train_symptom_model()
    
    print("\n" + "=" * 50)
    
    # Train doctor recommender
    doctor_model = train_doctor_recommender()

    print("\n" + "=" * 50)

    # Train RAG specialist recommender
    rag_vectorizer, rag_matrix = train_rag_specialist_recommender()

    print("\n" + "=" * 50)
    print("Training completed!")

