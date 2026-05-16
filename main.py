from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import shutil
import os
import json

from ml_engine import predict_career
from nlp_processor import parse_resume

app = FastAPI(title="AI Career Guidance API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

class AssessmentData(BaseModel):
    name: str
    age: int
    degree: str
    branch: str
    cgpa: float
    skills: List[str]
    interests: List[str]
    personality: dict
    goal: str

@app.get("/")
async def root():
    return {"message": "AI Career Guidance System API is running"}

@app.post("/predict")
async def get_prediction(data: AssessmentData):
    recommendations = predict_career(data.skills, data.interests)
    
    # Enrich recommendations with mock data (salary, demand, etc.)
    enriched = []
    for rec in recommendations[:3]: # Top 3
        career = rec["career"]
        enriched.append({
            **rec,
            "salary": get_mock_salary(career),
            "demand": get_mock_demand(career),
            "description": get_mock_description(career),
            "roadmap": get_mock_roadmap(career),
            "skill_gap": get_skill_gap(career, data.skills)
        })
        
    return {
        "user": data.name,
        "recommendations": enriched
    }

@app.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    parsed_data = parse_resume(file_path)
    return parsed_data

def get_mock_salary(career):
    salaries = {
        "AI Engineer": "₹15L - ₹35L",
        "Data Scientist": "₹12L - ₹28L",
        "ML Engineer": "₹14L - ₹32L",
        "Data Analyst": "₹6L - ₹12L",
        "Software Developer": "₹8L - ₹20L",
        "UI/UX Designer": "₹7L - ₹18L",
        "Research Scientist": "₹10L - ₹25L"
    }
    return salaries.get(career, "₹8L - ₹15L")

def get_mock_demand(career):
    demands = {
        "AI Engineer": "Very High",
        "Data Scientist": "High",
        "ML Engineer": "Very High",
        "Data Analyst": "Medium",
        "Software Developer": "High",
        "UI/UX Designer": "Medium",
        "Research Scientist": "High"
    }
    return demands.get(career, "Medium")

def get_mock_description(career):
    descriptions = {
        "AI Engineer": "Builds and deploys artificial intelligence models and systems.",
        "Data Scientist": "Analyzes complex data to help organizations make better decisions.",
        "ML Engineer": "Designs and implements machine learning algorithms and tools.",
        "Data Analyst": "Collects, processes and performs statistical analyses of data.",
        "Software Developer": "Creates, tests and maintains software applications.",
        "UI/UX Designer": "Focuses on the user experience and interface design of products.",
        "Research Scientist": "Conducts experiments and research to advance scientific knowledge."
    }
    return descriptions.get(career, "A promising career path in the technology sector.")

def get_mock_roadmap(career):
    # Standard roadmaps for top careers
    roadmaps = {
        "AI Engineer": [
            {"step": "Learn Python", "icon": "Code"},
            {"step": "Master Math (Linear Algebra, Calculus)", "icon": "Calculator"},
            {"step": "NumPy & Pandas for Data Manipulation", "icon": "Database"},
            {"step": "Machine Learning Fundamentals", "icon": "Brain"},
            {"step": "Deep Learning & Neural Networks", "icon": "Cpu"},
            {"step": "Deploying Models (MLOps)", "icon": "Rocket"}
        ],
        "Software Developer": [
            {"step": "Learn a Language (Java, Python, JS)", "icon": "Code"},
            {"step": "Data Structures & Algorithms", "icon": "Layers"},
            {"step": "Web Frameworks (React, Django)", "icon": "Layout"},
            {"step": "Database Management (SQL/NoSQL)", "icon": "Database"},
            {"step": "Version Control (Git)", "icon": "GitBranch"},
            {"step": "System Design", "icon": "Server"}
        ]
    }
    return roadmaps.get(career, [
        {"step": "Foundation Skills", "icon": "Book"},
        {"step": "Core Specialization", "icon": "Star"},
        {"step": "Build Projects", "icon": "Folder"},
        {"step": "Advanced Certification", "icon": "Award"}
    ])

def get_skill_gap(career, user_skills):
    required = {
        "AI Engineer": ["Deep Learning", "PyTorch", "MLOps", "TensorFlow"],
        "Data Scientist": ["Statistics", "R", "Tableau", "Data Visualization"],
        "ML Engineer": ["Production ML", "Docker", "Model Monitoring", "Cloud"],
        "Software Developer": ["Testing", "CI/CD", "System Architecture", "Security"],
        "UI/UX Designer": ["Figma", "User Research", "Prototyping", "A/B Testing"]
    }
    req = required.get(career, ["Advanced Research", "Specialized Tools"])
    gap = [s for s in req if s not in user_skills]
    return gap

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
