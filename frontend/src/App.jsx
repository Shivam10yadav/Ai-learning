import React from 'react'
import {BrowserRouter as Router,Routes,Route,Navigate} from 'react-router-dom'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import DocumentListPage from './pages/Documents/DocumentListPage'
import DocumentDetailPage from './pages/Documents/DocumentDetailPage'
import FlashcardPage from './pages/Flashcards/FlashcardPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultPage from './pages/Quizzes/QuizResultPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ProfilePage from './pages/Profile/ProfilePage'
import { useAuth } from './context/AuthContext'
import FlashcardListPage from './pages/Flashcards/FlashcardListPage'

const App = () => {
const{isAuthenticated,loading}=useAuth()

  if(loading){
    return(
    <div className='flex items-center justify-center h-screen'>
      <p>Loading...</p>
    </div>
    )
  }
  
  return (
    <Router>
      <Routes>
      <Route path='/' element={isAuthenticated ? <Navigate to='/dashboard' replace/> : <Navigate to='/login' replace/>}/>
      <Route path='/login' element={isAuthenticated ? <Navigate to='/dashboard' replace/> : <LoginPage/>}/>
      <Route path='/register' element={isAuthenticated ? <Navigate to='/dashboard' replace/> : <RegisterPage/>}/>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/documents" element={<DocumentListPage />} />
          <Route path="/documents/:id" element={<DocumentDetailPage />} />
          <Route path="/flashcards" element={<FlashcardListPage />} />
          <Route path="/documents/:id/flashcards" element={<FlashcardPage />} />
          <Route path="/quizzes/:quizId/attempt" element={<QuizTakePage/>} />
          <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 404 Page */}
        <Route path='*' element={<NotFoundPage/>}/>
      </Routes>
    </Router>
  )
}

export default App