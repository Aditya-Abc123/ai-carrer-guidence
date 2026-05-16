import pdfplumber
import spacy
import re

# Load spaCy model for NLP
# For a simple project, we can use rule-based matching for skills
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If not found, we'll provide instructions in README to download it
    pass

SKILL_DB = [
    "Python", "Machine Learning", "Deep Learning", "Web Development", 
    "Data Science", "SQL", "Statistics", "UI/UX", "Communication",
    "React", "Node.js", "Java", "C++", "JavaScript", "HTML", "CSS",
    "Cloud Computing", "AWS", "Azure", "Docker", "Kubernetes", "NLP",
    "Computer Vision", "TensorFlow", "PyTorch", "Tableau", "Power BI",
    "Excel", "Project Management", "Agile", "Scrum"
]

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_skills(text):
    skills_found = []
    # Simple case-insensitive matching
    text_lower = text.lower()
    for skill in SKILL_DB:
        # Use regex to find whole words only
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            skills_found.append(skill)
    return list(set(skills_found))

def parse_resume(file_path):
    text = extract_text_from_pdf(file_path)
    skills = extract_skills(text)
    
    # Simple logic to find "projects" or "experience" blocks (optional improvement)
    # For now, we focus on skills as requested
    
    return {
        "extracted_skills": skills,
        "text_preview": text[:500] + "..." # Return a snippet
    }
