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

      <div className="w-full max-w-2xl z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(255,255,255,0.05)] text-sm font-medium text-purple-300">
             <Sparkles className="w-4 h-4" />
             Vibecoding Enabled
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Focus on <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">Goals</span>
          </h1>
          <p className="text-zinc-400 text-lg">Manage your tasks with seamless Supabase synchronization.</p>
        </motion.div>

        {/* Backend Connectivity Badge */}
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-8 shadow-xl"
        >
            <span className="text-sm font-medium text-zinc-400">Express Network</span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${backendStatus.includes('smoothly') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
               <div className={`w-2 h-2 rounded-full ${backendStatus.includes('smoothly') ? 'bg-emerald-400' : 'bg-red-400'} animate-pulse`} />
               {backendStatus.includes('smoothly') ? 'Connected' : 'Offline'}
            </div>
        </motion.div>

        {/* Input Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl mb-8"
        >
          <form onSubmit={addTodo} className="relative group">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-zinc-950/50 border border-white/5 text-white text-lg rounded-2xl py-4 pl-6 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-6 h-6" />
            </button>
          </form>

          {/* Progress Bar */}
          {!loading && todos.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs font-medium text-zinc-500 mb-2">
                <span>Task Progress</span>
                <span>{completedCount} of {todos.length}</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Todo List Area */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
               <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : todos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 px-6 bg-zinc-900/20 backdrop-blur-sm border border-white/5 rounded-3xl border-dashed"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner">
                 <Sparkles className="w-8 h-8 text-zinc-500" />
              </div>
              <h3 className="text-xl font-medium text-zinc-300 mb-2">No tasks remaining</h3>
              <p className="text-zinc-500">Add a task above to kick off your day with a clear mind.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {todos.map(todo => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.2 }}
                  className={`group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border backdrop-blur-xl transition-all ${
                    todo.is_complete 
                      ? 'bg-zinc-900/30 border-white/5 opacity-60' 
                      : 'bg-zinc-900/70 border-white/10 hover:border-white/20 hover:bg-zinc-800/70 shadow-lg'
                  }`}
                >
                  <button 
                    onClick={() => toggleComplete(todo.id, todo.is_complete)}
                    className="flex-shrink-0 focus:outline-none group/btn transition-transform hover:scale-110 active:scale-90"
                  >
                    {todo.is_complete ? (
                      <CheckCircle2 className="w-7 h-7 text-purple-400 fill-purple-400/20" />
                    ) : (
                      <Circle className="w-7 h-7 text-zinc-500 group-hover/btn:text-purple-400 transition-colors" />
                    )}
                  </button>
                  
                  <span className={`flex-1 text-lg transition-all line-clamp-2 ${
                    todo.is_complete ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-200'
                  }`}>
                    {todo.task}
                  </span>
                  
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 p-2 text-zinc-500 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-rose-400 transition-all hover:bg-rose-400/10 rounded-xl"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </div>
  )
}

export default App
