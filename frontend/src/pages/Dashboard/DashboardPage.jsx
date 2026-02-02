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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-500 to-red-900 flex items-center justify-center relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 mb-4">
            <TrendingUp className="w-8 h-8 text-slate-300" />
          </div>
          <p className="text-slate-300 text-sm">No dashboard data available</p>
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
      link: '/documents'
    },
    {
      label: 'Total Flashcards',
      value: dashboardData.overview.totalFlashcards || 0,
      icon: BookOpen,
      gradient: 'from-purple-400 to-pink-500',
      shadowColor: 'shadow-purple-500/25',
      link: '/flashcards'
    },
    {
      label: 'Total Quizzes',
      value: dashboardData.overview.totalQuizzes || 0,
      icon: BrainCircuit,
      gradient: 'from-emerald-400 to-teal-500',
      shadowColor: 'shadow-emerald-500/25',
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

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
      blue: 'bg-blue-500/20 text-blue-300 border border-blue-400/30',
      emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
      purple: 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
      teal: 'bg-teal-500/20 text-teal-300 border border-teal-400/30',
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black-500 to-red-900 p-3 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative z-10 max-w-7xl mx-auto">
        {/* Header - More compact on mobile */}
        <div className="backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">Dashboard</h1>
          <p className="text-sm sm:text-base text-slate-300">Welcome back! Here's your learning overview</p>
        </div>

        {/* Main Stats Cards - Grid layout that wraps */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className="group relative overflow-hidden backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 hover:border-white/30 p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
                >
                  <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                        {stat.value}
                      </p>
                    </div>
                    
                    <div className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadowColor} group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                    </div>
                  </div>

                  <div className="relative mt-3 sm:mt-4 flex items-center text-xs sm:text-sm font-medium text-slate-400 group-hover:text-slate-200">
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              )
            })}
        </div>

        {/* Two Column Layout - Stack on mobile, side-by-side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity - Takes 2 columns on desktop, full width on mobile */}
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h2>
              </div>
              <Link
                to="/documents"
                className="text-xs sm:text-sm font-medium text-emerald-300 hover:text-emerald-200 flex items-center gap-1 group"
              >
                <span className="hidden sm:inline">View all</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {recentActivities.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-3 sm:mb-4">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
                  No Activity Yet
                </h3>
                <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 px-4">
                  Start uploading documents and taking quizzes to see your activity here
                </p>
                <Link
                  to="/documents"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm sm:text-base font-medium rounded-lg sm:rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <Link
                      key={`${activity.type}-${activity.id}`}
                      to={activity.link}
                      className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-white/10 backdrop-blur-sm transition-colors duration-200 group cursor-pointer"
                    >
                      <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl backdrop-blur-sm ${getActivityColor(activity.color)}`}>
                        <ActivityIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-300">
                          {activity.action}
                          {activity.score && (
                            <span className="ml-1 sm:ml-2 inline-flex items-center gap-1 text-emerald-300 font-medium">
                              <Award className="w-3 h-3" />
                              {activity.score}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">
                          {activity.timestamp}
                        </div>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-200 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Sidebar - Grid layout on mobile, column on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
              {/* Average Score */}
              <div className="backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Avg Score</h3>
                </div>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {dashboardData.overview.averageScore || 0}
                  </p>
                  <span className="text-lg sm:text-xl text-slate-300">%</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-2">
                  {dashboardData.overview.completedQuizzes || 0} quizzes
                </p>
              </div>

              {/* Flashcard Stats */}
              <div className="backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Flashcards</h3>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-300 flex items-center gap-1 sm:gap-2">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      Reviewed
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {dashboardData.overview.reviewedFlashcards || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-slate-300 flex items-center gap-1 sm:gap-2">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                      Starred
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      {dashboardData.overview.starredFlashcards || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Study Streak */}
              <div className="backdrop-blur-xl bg-white/10 rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-orange-400 to-red-500 text-white">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Streak</h3>
                </div>
                <div className="flex items-baseline gap-1 sm:gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-white">
                    {dashboardData.overview.studyStreak || 0}
                  </p>
                  <span className="text-lg sm:text-xl text-slate-300">days</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 sm:mt-2">Keep it up! 🔥</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default DashboardPage