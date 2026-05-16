import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Code, Calculator, Database, Brain, Cpu, Rocket, Book, Star, Folder, Award, Layers, Layout, Server, GitBranch } from 'lucide-react'

const ICON_MAP = {
  Code, Calculator, Database, Brain, Cpu, Rocket, Book, Star, Folder, Award, Layers, Layout, Server, GitBranch
}

const Roadmap = ({ career, steps }) => {
  return (
    <div className="glass-card p-8 rounded-3xl">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
        <Rocket className="text-primary-400" /> 
        Learning Roadmap for {career}
      </h3>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-800" />
        
        <div className="space-y-12">
          {steps.map((step, index) => {
            const IconComponent = ICON_MAP[step.icon] || Book
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex gap-12 items-start"
              >
                {/* Milestone Marker */}
                <div className="absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-primary-500 z-10" />
                
                {/* Icon Container */}
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400 z-20">
                  <IconComponent size={24} />
                </div>
                
                {/* Content */}
                <div className="flex-grow pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-primary-500 uppercase tracking-widest">Phase {index + 1}</span>
                    <div className="h-px flex-grow bg-slate-800/50" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">{step.step}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-lg">
                    Master the foundational principles and hands-on tools required to excel in this phase of your career journey.
                  </p>
                </div>
                
                {/* Status */}
                <div className="hidden md:flex flex-shrink-0 items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                  <Circle size={14} />
                  <span>To Do</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <div className="mt-12 p-6 bg-primary-600/5 border border-primary-500/10 rounded-2xl text-center">
        <p className="text-sm text-slate-400">
          This roadmap is dynamically generated based on current industry trends for <span className="text-white font-bold">{career}</span> roles in 2026.
        </p>
      </div>
    </div>
  )
}

export default Roadmap
