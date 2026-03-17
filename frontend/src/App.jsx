import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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
      const { data, error } = await supabase
        .from('todos')
        .update({ is_complete: !currentStatus })
        .eq('id', id)
        .select()
        
      if (error) throw error
      if (data) {
        setTodos(todos.map(todo => todo.id === id ? data[0] : todo))
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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center py-12 px-4 font-sans text-white">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Vibecoding Todos
          </h1>
          <p className="text-gray-400 text-lg">Test your Supabase integration in real-time.</p>
        </div>

        {/* Backend Status indicator */}
        <div className="bg-gray-900 shadow-2xl rounded-2xl p-4 mb-8 border border-gray-800 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-400">Express Backend:</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${backendStatus.includes('smoothly') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {backendStatus}
            </span>
        </div>

        {/* Todo App Box */}
        <div className="bg-gray-900 shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-800">
          
          <form onSubmit={addTodo} className="flex gap-3 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 bg-gray-950 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-3 transition-colors"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
            >
              Add
            </button>
          </form>

          {loading ? (
            <div className="flex justify-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              No tasks yet. Add one above to test the database!
            </div>
          ) : (
            <ul className="space-y-3">
              {todos.map(todo => (
                <li 
                  key={todo.id} 
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${todo.is_complete ? 'bg-gray-950/50 border-green-900/30' : 'bg-gray-800 border-gray-700 hover:border-gray-500'}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleComplete(todo.id, todo.is_complete)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.is_complete ? 'bg-green-500 border-green-500' : 'border-gray-500 hover:border-purple-400'}`}
                    >
                      {todo.is_complete && (
                        <svg className="w-4 h-4 text-gray-900" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </button>
                    <span className={`text-lg transition-all ${todo.is_complete ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                      {todo.task}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-4 text-gray-500 hover:text-red-400 transition-colors p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
