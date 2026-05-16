import { useState } from 'react'
import LandingPage from './components/LandingPage'
import AssessmentForm from './components/AssessmentForm'
import Dashboard from './components/Dashboard'
import { AnimatePresence } from 'framer-motion'

function App() {
  const [view, setView] = useState('landing') // landing, assessment, dashboard
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleStart = () => {
    setView('assessment')
  }

  const handleAssessmentComplete = (data) => {
    setResults(data)
    setView('dashboard')
  }

  const handleBackToHome = () => {
    setView('landing')
    setResults(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-mesh">
      <AnimatePresence mode="wait">
        {view === 'landing' && (
          <LandingPage onStart={handleStart} key="landing" />
        )}
        {view === 'assessment' && (
          <AssessmentForm 
            onComplete={handleAssessmentComplete} 
            onBack={handleBackToHome}
            key="assessment" 
          />
        )}
        {view === 'dashboard' && (
          <Dashboard 
            results={results} 
            onBack={handleBackToHome}
            key="dashboard" 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
