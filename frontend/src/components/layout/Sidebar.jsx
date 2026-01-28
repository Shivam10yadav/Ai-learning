import React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react"

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/60
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0 md:sticky md:top-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo & Close Button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <BrainCircuit className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                FlashMind
              </h1>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden inline-flex items-center justify-center w-8 h-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => window.innerWidth < 768 && toggleSidebar()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all duration-200 group
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`
                          flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200
                          ${
                            isActive
                              ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-500/30'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                          }
                        `}
                      >
                        <Icon size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-sm">{link.text}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200/60">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-red-100 group-hover:text-red-600 transition-all duration-200">
                <LogOut size={18} strokeWidth={2.5} />
              </div>
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar