import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { motion } from 'framer-motion'
import { Sparkles, Database, Server, Zap, ChevronRight, LayoutTemplate } from 'lucide-react'

function App() {
  const [backendStatus, setBackendStatus] = useState('Checking server...')
  const [dbStatus, setDbStatus] = useState('Checking database...')

  useEffect(() => {
    // Check Backend route
    fetch('/api/health')
      .then(res => res.json())
      .then(() => setBackendStatus('Server Online'))
      .catch(() => setBackendStatus('Server Offline'))
    
    // Check Supabase connection (by querying the table we just cleaned)
    const checkDb = async () => {
      try {
        const { error } = await supabase.from('todos').select('id').limit(1)
        if (error) throw error
        setDbStatus('Database Connected')
      } catch (error) {
        setDbStatus('Database Offline')
      }
    }
    checkDb()
  }, [])

  return (
    <div className="min-h-screen bg-[#030308] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-10000" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-[20%] left-[50%] w-[30%] h-[30%] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl flex flex-col items-center text-center"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <Sparkles className="w-4 h-4 text-fuchsia-400" />
          <span className="text-sm font-medium text-zinc-300">Vibecoding Ready</span>
        </motion.div>

        <h1 className="text-6xl sm:text-8xl font-extrabold tracking-tighter mb-6 text-white drop-shadow-2xl">
          Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">Start.</span>
        </h1>
        
        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
          The canvas is clear. The monorepo is primed. Your full-stack environment is fully operational and waiting for your masterpiece.
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-12">
          
          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-left flex flex-col overflow-hidden transition-all duration-300 hover:border-indigo-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <LayoutTemplate className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-white font-semibold text-lg mb-1">Frontend</h3>
            <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Vite / React Running
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-left flex flex-col overflow-hidden transition-all duration-300 hover:border-fuchsia-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(217,70,239,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-fuchsia-500 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Server className="w-8 h-8 text-fuchsia-400 mb-4" />
            <h3 className="text-white font-semibold text-lg mb-1">Backend (/api)</h3>
            <p className={`${backendStatus.includes('Online') ? 'text-emerald-400' : 'text-zinc-500'} text-sm font-medium flex items-center gap-1.5`}>
              {backendStatus.includes('Online') && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {backendStatus}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 text-left flex flex-col overflow-hidden transition-all duration-300 hover:border-rose-500/30 hover:bg-zinc-900/60 hover:shadow-[0_0_30px_rgba(244,63,94,0.1)]"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Database className="w-8 h-8 text-rose-400 mb-4" />
            <h3 className="text-white font-semibold text-lg mb-1">Supabase</h3>
            <p className={`${dbStatus.includes('Connected') ? 'text-emerald-400' : 'text-zinc-500'} text-sm font-medium flex items-center gap-1.5`}>
              {dbStatus.includes('Connected') && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
              {dbStatus}
            </p>
          </motion.div>

        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          <Zap className="w-5 h-5 text-indigo-400 group-hover:text-fuchsia-400 transition-colors" />
          <span>Start Building</span>
          <ChevronRight className="w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </motion.button>

      </motion.div>
    </div>
  )
}

export default App
