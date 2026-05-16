import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Award, Briefcase, TrendingUp, IndianRupee, ArrowRight, Target, Info } from 'lucide-react'
import Roadmap from './Roadmap'

const Dashboard = ({ results, onBack }) => {
  const [selectedCareer, setSelectedCareer] = useState(results.recommendations[0])

  const chartData = results.recommendations.map(r => ({
    name: r.career,
    match: r.match_percentage
  }))

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981']

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            &larr; Back to Assessment
          </button>
          <h1 className="text-4xl font-bold">Your Career <span className="text-gradient">Analysis</span></h1>
          <p className="text-slate-400 mt-2">Analysis complete for {results.user}. Here are your top matches.</p>
        </div>
        <div className="flex gap-4">
          <div className="p-4 glass rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-primary-400">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Top Match</p>
              <p className="font-bold text-lg">{results.recommendations[0].career}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Careers */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2"><Target size={20} className="text-primary-400" /> Recommendations</h2>
          {results.recommendations.map((rec, index) => (
            <motion.div
              key={rec.career}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedCareer(rec)}
              className={`p-6 cursor-pointer rounded-3xl border transition-all ${selectedCareer.career === rec.career ? 'bg-primary-600/10 border-primary-500 shadow-lg shadow-primary-500/10' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-xl">{rec.career}</h3>
                <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-full text-xs font-bold">{rec.match_percentage}% Match</span>
              </div>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2">{rec.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <TrendingUp size={16} className="text-green-400" />
                  <span>{rec.demand} Demand</span>
                </div>
                <ArrowRight size={18} className={selectedCareer.career === rec.career ? 'text-primary-400' : 'text-slate-600'} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column: Visualization & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-3xl h-80">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Match Comparison</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  />
                  <Bar dataKey="match" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="glass-card p-6 rounded-3xl h-80">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Career Insights</h3>
              <div className="space-y-6">
                <InsightItem 
                  icon={<Briefcase className="text-blue-400" />} 
                  label="Selected Career" 
                  value={selectedCareer.career} 
                />
                <InsightItem 
                  icon={<IndianRupee className="text-green-400" />} 
                  label="Est. Salary" 
                  value={selectedCareer.salary} 
                />
                <InsightItem 
                  icon={<TrendingUp className="text-purple-400" />} 
                  label="Job Stability" 
                  value="High Growth" 
                />
              </div>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="glass-card p-8 rounded-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500">
                <Info size={20} />
              </div>
              <h3 className="text-xl font-bold">Skill Gap Analysis</h3>
            </div>
            <p className="text-slate-400 mb-6">To excel as an <span className="text-white font-bold">{selectedCareer.career}</span>, you should consider mastering these skills:</p>
            <div className="flex flex-wrap gap-3">
              {selectedCareer.skill_gap.map(skill => (
                <div key={skill} className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-sm font-medium">
                  + {skill}
                </div>
              ))}
              {selectedCareer.skill_gap.length === 0 && (
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-sm font-medium">
                  Your skill profile perfectly matches this role!
                </div>
              )}
            </div>
          </div>

          {/* Roadmap Component */}
          <Roadmap career={selectedCareer.career} steps={selectedCareer.roadmap} />
        </div>
      </div>
    </div>
  )
}

const InsightItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium uppercase">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  </div>
)

export default Dashboard
