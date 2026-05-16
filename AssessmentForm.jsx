import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Code, Heart, Brain, Target, Upload, Check, AlertCircle, Loader2 } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

const AssessmentForm = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resumeData, setResumeData] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    age: 21,
    degree: '',
    branch: '',
    cgpa: '',
    skills: [],
    interests: [],
    personality: {
      logic: true,
      teamwork: true,
      public: false,
      creativity: true
    },
    goal: 'Innovation'
  })

  const SKILLS_OPTIONS = ["Python", "Machine Learning", "Deep Learning", "Web Development", "Data Science", "SQL", "Statistics", "UI/UX", "Communication"]
  const INTERESTS_OPTIONS = ["Artificial Intelligence", "Research", "Business", "Creativity", "Government Jobs", "Analytics", "Problem Solving"]
  const GOAL_OPTIONS = ["High Salary", "Innovation", "Stability", "Research", "Leadership"]

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setLoading(true)
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await axios.post(`${API_URL}/upload_resume`, uploadData)
      setResumeData(res.data)
      // Automatically add extracted skills to form
      const extracted = res.data.extracted_skills
      setFormData(prev => ({
        ...prev,
        skills: [...new Set([...prev.skills, ...extracted])]
      }))
    } catch (err) {
      setError('Failed to parse resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await axios.post(`${API_URL}/predict`, formData)
      onComplete(res.data)
    } catch (err) {
      setError('Prediction failed. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 transition-colors">
          &larr; Back to Home
        </button>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= s ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-500 border border-white/5'}`}>
                {step > s ? <Check size={18} /> : s}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary-500 h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><User className="text-primary-400" /> Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="Enter your name" />
              <Input label="Age" type="number" value={formData.age} onChange={v => setFormData({...formData, age: v})} />
              <Input label="Degree" value={formData.degree} onChange={v => setFormData({...formData, degree: v})} placeholder="e.g. B.Tech" />
              <Input label="Branch" value={formData.branch} onChange={v => setFormData({...formData, branch: v})} placeholder="e.g. Computer Science" />
              <Input label="CGPA" type="number" step="0.01" value={formData.cgpa} onChange={v => setFormData({...formData, cgpa: v})} placeholder="e.g. 9.2" />
            </div>
            <div className="mt-8 flex justify-end">
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Code className="text-primary-400" /> Skills Selection</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {SKILLS_OPTIONS.map(skill => (
                <Checkbox key={skill} label={skill} checked={formData.skills.includes(skill)} onChange={() => toggleSkill(skill)} />
              ))}
            </div>
            
            <div className="mt-12 p-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Upload size={18} /> Or Upload Resume</h3>
              <p className="text-sm text-slate-400 mb-4">We'll automatically extract skills from your PDF/DOCX resume.</p>
              <input type="file" onChange={handleFileUpload} className="hidden" id="resume-upload" accept=".pdf,.doc,.docx" />
              <label htmlFor="resume-upload" className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Upload size={18} />} {resumeData ? 'Resume Uploaded!' : 'Select File'}
              </label>
              {resumeData && (
                <div className="mt-4 text-xs text-green-400 flex items-center gap-2">
                  <Check size={12} /> Extracted {resumeData.extracted_skills.length} skills
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Heart className="text-primary-400" /> Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INTERESTS_OPTIONS.map(interest => (
                <Checkbox key={interest} label={interest} checked={formData.interests.includes(interest)} onChange={() => toggleInterest(interest)} />
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Brain className="text-primary-400" /> Personality</h2>
            <div className="space-y-6">
              <RadioQuestion label="Do you enjoy logical problem solving?" value={formData.personality.logic} onChange={v => setFormData({...formData, personality: {...formData.personality, logic: v}})} />
              <RadioQuestion label="Do you prefer working in teams?" value={formData.personality.teamwork} onChange={v => setFormData({...formData, personality: {...formData.personality, teamwork: v}})} />
              <RadioQuestion label="Do you enjoy public interaction?" value={formData.personality.public} onChange={v => setFormData({...formData, personality: {...formData.personality, public: v}})} />
              <RadioQuestion label="Do you enjoy creativity and design?" value={formData.personality.creativity} onChange={v => setFormData({...formData, personality: {...formData.personality, creativity: v}})} />
            </div>
            <div className="mt-8 flex justify-between">
              <Button variant="ghost" onClick={handlePrev}>Previous</Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-8 rounded-3xl text-center">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2"><Target className="text-primary-400" /> Final Step: Career Goal</h2>
            <p className="text-slate-400 mb-8">What is your primary motivation in your professional life?</p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {GOAL_OPTIONS.map(goal => (
                <button 
                  key={goal} 
                  onClick={() => setFormData({...formData, goal})}
                  className={`px-6 py-3 rounded-2xl border transition-all ${formData.goal === goal ? 'bg-primary-600 border-primary-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
                >
                  {goal}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-center gap-2 justify-center">
                <AlertCircle size={18} /> {error}
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={handlePrev}>Previous</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : 'Generate Results'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm font-medium text-slate-400">{label}</label>
    <input 
      {...props} 
      onChange={e => props.onChange(e.target.value)}
      className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary-500 transition-all" 
    />
  </div>
)

const Checkbox = ({ label, checked, onChange }) => (
  <button 
    onClick={onChange}
    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${checked ? 'bg-primary-600/20 border-primary-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'}`}
  >
    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${checked ? 'bg-primary-600 border-primary-500' : 'border-white/20'}`}>
      {checked && <Check size={14} />}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </button>
)

const RadioQuestion = ({ label, value, onChange }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
    <span className="text-slate-300 font-medium">{label}</span>
    <div className="flex gap-4">
      <button onClick={() => onChange(true)} className={`px-6 py-2 rounded-xl border transition-all ${value === true ? 'bg-primary-600/40 border-primary-500' : 'bg-white/5 border-white/10'}`}>Yes</button>
      <button onClick={() => onChange(false)} className={`px-6 py-2 rounded-xl border transition-all ${value === false ? 'bg-primary-600/40 border-primary-500' : 'bg-white/5 border-white/10'}`}>No</button>
    </div>
  </div>
)

const Button = ({ children, variant = 'primary', ...props }) => {
  const styles = variant === 'primary' 
    ? 'bg-primary-600 hover:bg-primary-500 text-white' 
    : 'bg-white/5 hover:bg-white/10 text-slate-300'
  
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props} 
      className={`px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles}`}
    >
      {children}
    </motion.button>
  )
}

export default AssessmentForm
