import React, { useState, useEffect } from 'react'
import Spinner from '../../components/common/Spinner'
import progressService from '../../services/progressService'
import toast from 'react-hot-toast'
import { 
  FileText, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Award,
  Calendar,
  CheckCircle2,
  Star,
  Eye
} from 'lucide-react'
import { Link } from 'react-router-dom'

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await progressService.getDashboardData()
        console.log('Data__getDashboardData', data)
        setDashboardData(data.data)
      } catch (error) {
        toast.error('Failed to fetch dashboard data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-600 text-sm">No dashboard data available</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Documents',
      value: dashboardData.overview.totalDocuments || 0,
      icon: FileText,
      gradient: 'from-blue-400 to-cyan-500',
      shadowColor: 'shadow-blue-500/25',
      bgGradient: 'from-blue-50 to-cyan-50',
      link: '/documents'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards || 0,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25',
      bgGradient: 'from-purple-50 to-pink-50',
      link: '/flashcards'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes || 0,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
      bgGradient: 'from-emerald-50 to-teal-50',
      link: '/documents'
    },
  ]

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    const now = new Date()
    const diffMs = now - d
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Combine recent documents and quizzes into a single activity feed
  const recentActivities = [
    ...(dashboardData.recentActivity?.documents || []).map(doc => ({
      id: doc._id,
      type: 'document',
      title: doc.title || doc.fileName,
      action: 'Uploaded',
      timestamp: formatDate(doc.lastAccessed || doc.createdAt),
      icon: FileText,
      color: 'blue',
      link: `/documents/${doc._id}`,
      status: doc.status
    })),
    ...(dashboardData.recentActivity?.quizzes || []).map(quiz => ({
      id: quiz._id,
      type: 'quiz',
      title: quiz.title || quiz.documentId?.title || 'Quiz',
      action: 'Completed',
      score: quiz.score ? `${quiz.score}%` : null,
      timestamp: formatDate(quiz.completedAt),
      icon: BrainCircuit,
      color: 'emerald',
      link: `/quizzes/${quiz._id}/results`,
      totalQuestions: quiz.totalQuestions
    }))
  ].sort((a, b) => {
    // Sort by most recent
    const dateA = new Date(a.timestamp)
    const dateB = new Date(b.timestamp)
    return dateB - dateA
  }).slice(0, 8) // Show only 8 most recent

  const getActivityIcon = (type) => {
    const icons = {
      document: FileText,
      quiz: BrainCircuit,
      flashcard: BookOpen,
    }
    return icons[type] || FileText
  }

  const getActivityColor = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      emerald: 'bg-emerald-100 text-emerald-600',
      purple: 'bg-purple-100 text-purple-600',
      teal: 'bg-teal-100 text-teal-600',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your learning overview</p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Link
              key={index}
              to={stat.link}
              className="group relative overflow-hidden bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold text-slate-900 mb-1">
                    {stat.value}
                  </p>
                </div>
                
                <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>

              <div className="relative mt-4 flex items-center text-sm font-medium text-slate-500 group-hover:text-slate-700">
                <span>View all</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200">
                <Clock className="w-5 h-5 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            </div>
            <Link
              to="/documents"
              className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              View all
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-4">
                <Clock className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No Activity Yet
              </h3>
              <p className="text-slate-600 mb-6">
                Start uploading documents and taking quizzes to see your activity here
              </p>
              <Link
                to="/documents"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
              >
                Get Started
                <ChevronRight size={18} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type)
                return (
                  <Link
                    key={`${activity.type}-${activity.id}`}
                    to={activity.link}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200 group cursor-pointer"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${getActivityColor(activity.color)}`}>
                      <ActivityIcon className="w-6 h-6" strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {activity.action}
                        {activity.score && (
                          <span className="ml-2 inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Award className="w-3 h-3" />
                            {activity.score}
                          </span>
                        )}
                      </p>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      {activity.timestamp}
                    </div>
                    
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Stats Sidebar - Takes 1 column */}
        <div className="space-y-6">
          {/* Average Score */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Average Score</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-900">
                {dashboardData.overview.averageScore || 0}
              </p>
              <span className="text-xl text-slate-600">%</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {dashboardData.overview.completedQuizzes || 0} quizzes completed
            </p>
          </div>

          {/* Flashcard Stats */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Flashcards</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Reviewed
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {dashboardData.overview.reviewedFlashcards || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Starred
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  {dashboardData.overview.starredFlashcards || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Study Streak */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Study Streak</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-slate-900">
                {dashboardData.overview.studyStreak || 0}
              </p>
              <span className="text-xl text-slate-600">days</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">Keep it up! 🔥</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage