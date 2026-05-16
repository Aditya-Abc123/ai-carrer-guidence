import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
import joblib
import os

# Define Careers and their associated features
CAREERS = [
    "AI Engineer", "Data Scientist", "ML Engineer", "Data Analyst", 
    "Software Developer", "UI/UX Designer", "Research Scientist"
]

SKILLS_LIST = [
    "Python", "Machine Learning", "Deep Learning", "Web Development", 
    "Data Science", "SQL", "Statistics", "UI/UX", "Communication"
]

INTERESTS_LIST = [
    "Artificial Intelligence", "Research", "Business", "Creativity", 
    "Government Jobs", "Analytics", "Problem Solving"
]

def generate_synthetic_data(samples=1000):
    data = []
    for _ in range(samples):
        # Random skills (1 to 5)
        skills = np.random.choice(SKILLS_LIST, size=np.random.randint(1, 6), replace=False).tolist()
        # Random interests (1 to 4)
        interests = np.random.choice(INTERESTS_LIST, size=np.random.randint(1, 4), replace=False).tolist()
        
        # Simple heuristic for "Label" generation for training
        if "Deep Learning" in skills or "Artificial Intelligence" in interests:
            label = "AI Engineer" if "Python" in skills else "Research Scientist"
        elif "Data Science" in skills or "Statistics" in skills:
            label = "Data Scientist" if "Analytics" in interests else "Data Analyst"
        elif "UI/UX" in skills or "Creativity" in interests:
            label = "UI/UX Designer"
        elif "Web Development" in skills or "SQL" in skills:
            label = "Software Developer"
        else:
            label = np.random.choice(CAREERS)
            
        data.append({
            "skills": skills,
            "interests": interests,
            "label": label
        })
    return pd.DataFrame(data)

def train_model():
    df = generate_synthetic_data()
    
    # Preprocessing
    mlb_skills = MultiLabelBinarizer(classes=SKILLS_LIST)
    mlb_interests = MultiLabelBinarizer(classes=INTERESTS_LIST)
    
    X_skills = mlb_skills.fit_transform(df['skills'])
    X_interests = mlb_interests.fit_transform(df['interests'])
    
    X = np.hstack((X_skills, X_interests))
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Save model and encoders
    model_path = os.path.join(os.path.dirname(__file__), "../models/career_model.joblib")
    joblib.dump({
        "model": model,
        "mlb_skills": mlb_skills,
        "mlb_interests": mlb_interests,
        "careers": CAREERS
    }, model_path)
    
    print(f"Model trained and saved to {model_path}")

def predict_career(skills, interests):
    model_path = os.path.join(os.path.dirname(__file__), "../models/career_model.joblib")
    if not os.path.exists(model_path):
        train_model()
        
    data = joblib.load(model_path)
    model = data["model"]
    mlb_skills = data["mlb_skills"]
    mlb_interests = data["mlb_interests"]
    
    X_skills = mlb_skills.transform([skills])
    X_interests = mlb_interests.transform([interests])
    X = np.hstack((X_skills, X_interests))
    
    probs = model.predict_proba(X)[0]
    classes = model.classes_
    
    results = []
    for cls, prob in zip(classes, probs):
        results.append({
            "career": cls,
            "match_percentage": round(prob * 100, 2)
        })
    
    # Sort by match percentage
    results = sorted(results, key=lambda x: x['match_percentage'], reverse=True)
    return results

if __name__ == "__main__":
    train_model()
