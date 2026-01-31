import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-900 via-black to-red-900 text-white overflow-hidden relative'>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '500ms' }}></div>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      
      <div className='flex-1 flex flex-col overflow-hidden relative z-10'>
        <Header toggleSidebar={toggleSidebar}/>
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppLayout