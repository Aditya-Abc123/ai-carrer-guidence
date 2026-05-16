import { motion } from 'framer-motion'
import { Brain, Rocket, Search, Target, ChevronRight } from 'lucide-react'

const LandingPage = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium border rounded-full glass border-white/10 text-primary-400">
          <Brain size={16} />
          <span>AI-Powered Career Guidance</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Unlock Your <span className="text-gradient">Future Career</span> with Precision AI
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover the perfect career path based on your unique skills, interests, and personality. 
          Our advanced NLP engine analyzes your resume to provide personalized roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-primary-500/20 transition-all"
          >
            Start Assessment <ChevronRight size={20} />
          </motion.button>
          
          <button className="px-8 py-4 glass text-white rounded-xl font-semibold hover:bg-white/5 transition-all">
            How it Works
          </button>
        </div>
      </motion.div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">
        <FeatureCard 
          icon={<Search className="text-blue-400" />}
          title="Resume Analysis"
          description="Upload your resume and let our NLP engine extract hidden skills and projects automatically."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Target className="text-purple-400" />}
          title="Personalized Paths"
          description="Receive tailored recommendations that align with your personality and long-term goals."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Rocket className="text-pink-400" />}
          title="Learning Roadmaps"
          description="Get a step-by-step dynamic timeline to bridge your skill gaps and reach your dream job."
          delay={0.6}
        />
      </div>

      {/* Intro section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-32 text-center max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-6">Designed for the Next Generation of Tech Leaders</h2>
        <p className="text-slate-400">
          Empowering professionals to navigate their career journey with data-driven precision. 
          Our system leverages advanced Machine Learning and NLP to decode your unique potential 
          and map it to the high-growth roles of the future.
        </p>
      </motion.div>
    </div>
  )
}

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="p-8 glass-card rounded-2xl"
  >
    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 border border-white/10">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
)

export default LandingPage
