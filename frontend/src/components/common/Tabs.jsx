import React from 'react'

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className='w-full backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6'>
      <div className='relative border-b-2 border-white/20'>
        <nav className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button 
              key={tab.name} 
              onClick={() => setActiveTab(tab.name)} 
              className={`relative pb-4 px-6 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name 
                  ? 'text-emerald-300' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className='relative z-10'>{tab.label}</span>
              {activeTab === tab.name && (
                <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-500/50'/>
              )}

              {activeTab === tab.name && (
                <div className='absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-t-xl -z-10'/>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className='py-6'>
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className='animate-in fade-in duration-200'>
                {tab.content}
              </div>
            )
          }
          return null
        })}
      </div>
    </div>
  )
}

export default Tabs