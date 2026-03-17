import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Trash2, Plus, Sparkles, Loader2 } from 'lucide-react'

function App() {
  const [todos, setTodos] = useState([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)
  const [backendStatus, setBackendStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Failed to connect: ' + err.message))
    
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTask.trim() }])
        .select()
      
      if (error) throw error
      if (data) setTodos([data[0], ...todos])
      setNewTask('')
    } catch (error) {
       console.error('Error adding todo:', error.message)
    }
  }

  const toggleComplete = async (id, currentStatus) => {
    try {
      // Optimistic Update
      setTodos(todos.map(todo => todo.id === id ? { ...todo, is_complete: !currentStatus } : todo))

      const { data, error } = await supabase
        .from('todos')
        .update({ is_complete: !currentStatus })
        .eq('id', id)
        .select()
        
      if (error) {
        // Revert on error
         setTodos(todos.map(todo => todo.id === id ? { ...todo, is_complete: currentStatus } : todo))
         throw error
      }
    } catch (error) {
      console.error('Error updating todo:', error.message)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error.message)
    }
  }

  // Calculate progress
  const completedCount = todos.filter(t => t.is_complete).length;
  const progressPercent = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Background Decorative Layer */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>

      <div className="w-full max-w-5xl z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-sm font-medium text-indigo-300">
             <Sparkles className="w-4 h-4" />
             Vibecoding Dashboard
          </div>
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-4 text-white">
            Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Objectives</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">Manage your tasks with seamless Supabase synchronization in a beautiful card layout.</p>
        </motion.div>

        {/* Top Bar: Input + Details */}
        <div className="flex flex-col md:flex-row gap-6 mb-10 w-full">
            {/* Input Card */}
            <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="flex-1 bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-2 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 pointer-events-none"></div>
                <form onSubmit={addTodo} className="relative z-10 flex gap-2 h-14">
                    <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Create a new objective..."
                    className="flex-1 bg-transparent text-white text-lg px-6 focus:outline-none placeholder:text-zinc-500"
                    />
                    <button
                    type="submit"
                    disabled={!newTask.trim()}
                    className="aspect-square h-full bg-white text-zinc-950 rounded-2xl flex items-center justify-center transition-all hover:scale-95 active:scale-90 disabled:opacity-30 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                    >
                    <Plus className="w-6 h-6 stroke-[3]" />
                    </button>
                </form>
            </motion.div>

            {/* Stats Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="w-full md:w-72 bg-zinc-900/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-center"
            >
                <div className="flex items-center justify-between mb-3 text-sm">
                    <span className="text-zinc-400 font-medium">Completion Rate</span>
                    <span className="text-white font-bold">{completedCount} / {todos.length}</span>
                </div>
                <div className="h-2 w-full bg-zinc-800/80 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                    <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"
                    />
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">API Status</span>
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${backendStatus.includes('smoothly') ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-500'} `} />
                        <span className="text-xs font-semibold text-zinc-300">
                             {backendStatus.includes('smoothly') ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Todo Grid Area */}
        <div className="w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4 shadow-indigo-500/50" />
               <p className="text-zinc-500 font-medium animate-pulse">Syncing with Supabase...</p>
            </div>
          ) : todos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-6 bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[2rem] border-dashed"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-2xl">
                 <Sparkles className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">The board is clear</h3>
              <p className="text-zinc-400 max-w-sm mx-auto">Create a new objective above to start structuring your day.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {todos.map(todo => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.2 } }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-[2rem] border backdrop-blur-2xl transition-all duration-300 min-h-[160px] ${
                      todo.is_complete 
                        ? 'bg-zinc-900/40 border-white/5 shadow-none' 
                        : 'bg-zinc-800/80 border-white/10 hover:border-indigo-500/30 hover:bg-zinc-800 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-indigo-500/10 hover:-translate-y-1'
                    }`}
                  >
                    {/* Background glow for active cards */}
                    {!todo.is_complete && (
                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/5 opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-500 pointer-events-none"></div>
                    )}

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                                {new Date(todo.created_at || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                            </span>
                            
                            {/* Actions Group */}
                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                                <button 
                                onClick={() => deleteTodo(todo.id)}
                                className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all"
                                >
                                <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        <p className={`text-xl font-medium leading-snug transition-all duration-300 ${
                            todo.is_complete ? 'text-zinc-600 line-through decoration-zinc-700/50' : 'text-zinc-100 group-hover:text-white'
                        }`}>
                            {todo.task}
                        </p>
                    </div>

                    <div className="relative z-10 flex items-center mt-6">
                        <button 
                            onClick={() => toggleComplete(todo.id, todo.is_complete)}
                            className={`flex items-center gap-3 py-2 px-4 rounded-xl border transition-all duration-300 ${
                                todo.is_complete
                                ? 'bg-zinc-800/50 border-white/5 text-zinc-400 hover:bg-zinc-800'
                                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                            }`}
                        >
                            {todo.is_complete ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
                                </>
                            ) : (
                                <>
                                    <Circle className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Mark Done</span>
                                </>
                            )}
                        </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App
