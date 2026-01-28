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
];

  return(
 <>
  <div></div>
  </>
  ) 
 
}

export default Sidebar
