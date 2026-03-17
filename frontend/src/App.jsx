import { useState, useEffect } from 'react'

function App() {
  const [backendStatus, setBackendStatus] = useState('Loading...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setBackendStatus(data.message))
      .catch(err => setBackendStatus('Failed to connect to backend: ' + err.message))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white font-sans p-4">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-8 max-w-lg w-full text-center border border-gray-800">
        <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Vibecoding Ready 🚀
        </h1>
        <p className="text-gray-400 mb-6 text-lg">
          Your React + Express monorepo is successfully set up and wired together.
        </p>
        
        <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-between border border-gray-700">
          <span className="text-sm font-semibold text-gray-300">Backend Status:</span>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${backendStatus.includes('smoothly') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {backendStatus}
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
