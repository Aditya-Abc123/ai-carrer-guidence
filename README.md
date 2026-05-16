# AI Career Guidance System

A professional-grade, full-stack AI application designed to help students discover their ideal career paths using Machine Learning and Natural Language Processing.

## 🚀 Features
- **Modern Landing Page**: High-performance UI with Framer Motion animations.
- **Multi-step Assessment**: Analyzes skills, interests, education, and personality.
- **Resume Parsing**: Automatically extracts skills from PDF/DOCX using spaCy and NLP.
- **ML Engine**: Career recommendations using a Random Forest model trained on synthetic career data.
- **Professional Dashboard**: Interactive charts (Recharts), salary insights, and demand analysis.
- **Dynamic Roadmap**: Step-by-step vertical timeline for the selected career path.

## 🛠️ Tech Stack
- **Frontend**: React, Tailwind CSS, Vite, Framer Motion, Recharts, Lucide Icons.
- **Backend**: FastAPI (Python), Scikit-learn, spaCy, pdfplumber.
- **ML**: Random Forest Classifier.

## 📦 Project Structure
```text
ai-career-guidance/
├── backend/
│   ├── main.py          # FastAPI Endpoints
│   ├── ml_engine.py      # ML Prediction & Training logic
│   ├── nlp_processor.py  # Resume Parsing logic
│   ├── setup.py         # One-click environment setup
│   └── requirements.txt  # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/  # React Components
│   │   ├── App.jsx      # Main Application logic
│   │   └── index.css    # Global styles & Glassmorphism
│   ├── package.json     # Node dependencies
│   └── tailwind.config.js
└── models/
    └── career_model.joblib # Trained ML Model
```

## ⚙️ Setup Instructions

### Backend Setup
1. Open a terminal in the `backend/` directory.
2. Run the setup script to install dependencies and train the model:
   ```bash
   python setup.py
   ```
3. Start the backend server:
   ```bash
   python main.py
   ```
   *The API will be available at http://localhost:8000*

### Frontend Setup
1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The web app will be available at http://localhost:5173*

## 📝 Usage
1. Click **"Start Assessment"** on the home page.
2. Fill in your personal details.
3. Upload your resume to automatically populate skills.
4. Answer the personality and goal questions.
5. Explore your personalized career dashboard and roadmap!

---
*Created as a final-year major project for AI/ML students.*
