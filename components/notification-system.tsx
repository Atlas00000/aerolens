"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, Plane } from "lucide-react"
import { useFlightStore } from "@/lib/stores/flight-store"

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { isConnected, aircraft } = useFlightStore()

  // Auto-generate notifications based on app state
  useEffect(() => {
    if (isConnected && Object.keys(aircraft).length > 0) {
      addNotification({
        type: 'success',
        title: 'Connected',
        message: `Tracking ${Object.keys(aircraft).length} aircraft in real-time`,
        duration: 3000
      })
    }
  }, [isConnected, aircraft])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    
    setNotifications(prev => [...prev, newNotification])

    if (notification.duration) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <Plane className="w-5 h-5 text-blue-400" />
    }
  }

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10'
      case 'error':
        return 'border-red-500/30 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10'
      default:
        return 'border-blue-500/30 bg-blue-500/10'
    }
  }

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`glass-effect-dark border ${getTypeStyles(notification.type)} shadow-2xl rounded-lg p-4 w-80 animate-slide-in-right`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            transform: `translateX(${index * 10}px)`
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white mb-1">
                {notification.title}
              </div>
              <div className="text-xs text-slate-300">
                {notification.message}
              </div>
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Progress bar for timed notifications */}
          {notification.duration && (
            <div className="mt-3 h-0.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ 
                  width: '100%',
                  animation: 'shrink 3s linear forwards'
                }}
              />
            </div>
          )}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  )
} 