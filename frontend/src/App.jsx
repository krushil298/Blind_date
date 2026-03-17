import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
function App() {
  const [backendStatus, setBackendStatus] = useState('Loading...')
  const [supabaseStatus, setSupabaseStatus] = useState('Not tested yet')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Failed to connect to backend: ' + err.message))
  }, [])

  const testSupabase = async () => {
    setSupabaseStatus('Testing...')
    try {
      // Simple query to verify network and auth works
      const { data, error } = await supabase.from('test_table_does_not_exist').select('*').limit(1)
      if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        // 42P01 means relation does not exist, which actively confirms we reached the db successfully!
        throw error
      }
      setSupabaseStatus('Connected successfully! 🟢 (Project: blind_date)')
    } catch (err) {
      if (err.code === '42P01') {
         setSupabaseStatus('Connected successfully! 🟢 (Project: blind_date)')
      } else {
         setSupabaseStatus('Connection Failed 🔴: ' + err.message)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white font-sans p-4">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center border border-gray-800">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Vibecoding Ready 🚀
        </h1>
        <p className="text-gray-400 mb-6 text-lg">
          Your React + Express monorepo is successfully set up and wired together.
        </p>
        
        <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center justify-between border border-gray-700">
          <span className="text-sm font-semibold text-gray-300">Backend Status:</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${backendStatus.includes('smoothly') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {backendStatus}
          </span>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 flex flex-col gap-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-300">Supabase DB:</span>
            <span className={`text-sm font-bold px-3 py-1 rounded-full ${supabaseStatus.includes('Connected') ? 'bg-green-500/20 text-green-400' : (supabaseStatus.includes('Failed') ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300')}`}>
              {supabaseStatus}
            </span>
          </div>
          <button 
            onClick={testSupabase}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Test Supabase Connection
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
