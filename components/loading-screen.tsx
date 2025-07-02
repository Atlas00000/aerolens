"use client"

import { useState, useEffect } from "react"
import { Plane, Wifi, Globe, Zap } from "lucide-react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const steps = [
    { icon: Globe, text: "Initializing 3D Environment", duration: 2000 },
    { icon: Wifi, text: "Connecting to Flight Data", duration: 1500 },
    { icon: Plane, text: "Loading Aircraft Models", duration: 1800 },
    { icon: Zap, text: "Optimizing Performance", duration: 1200 }
  ]

  useEffect(() => {
    let currentProgress = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)
    const progressPerMs = 100 / totalDuration

    const interval = setInterval(() => {
      currentProgress += progressPerMs * 16 // 60fps
      setProgress(Math.min(currentProgress, 100))

      // Update current step based on progress
      let accumulatedTime = 0
      for (let i = 0; i < steps.length; i++) {
        accumulatedTime += steps[i].duration
        if (currentProgress <= (accumulatedTime / totalDuration) * 100) {
          setCurrentStep(i)
          break
        }
      }

      if (currentProgress >= 100) {
        clearInterval(interval)
        setTimeout(() => setIsVisible(false), 500)
      }
    }, 16)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse-glow blur-xl"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-500/20 rounded-full animate-pulse-glow blur-xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-indigo-500/10 rounded-full animate-pulse-glow blur-xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo and Title */}
        <div className="mb-8 animate-scale-in">
          <div className="relative inline-block">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-rotate-3d"></div>
              <div className="absolute inset-2 bg-slate-900 rounded-full flex items-center justify-center">
                <Plane className="w-8 h-8 text-white animate-float" />
              </div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-xl animate-pulse-glow"></div>
          </div>
          
          <h1 className="text-4xl font-bold text-gradient mb-2 animate-slide-in-up">
            AeroLens
          </h1>
          <p className="text-slate-400 text-lg animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Real-time Flight Tracking
          </p>
        </div>

        {/* Progress Section */}
        <div className="w-96 mx-auto animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Current Step */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === currentStep
                const isCompleted = index < currentStep
                
                return (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-110 animate-pulse-glow' 
                        : isCompleted 
                        ? 'bg-green-500' 
                        : 'bg-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive || isCompleted ? 'text-white' : 'text-slate-400'
                    }`} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Text */}
          <div className="h-8 mb-4">
            <p className="text-white font-medium animate-fade-in">
              {steps[currentStep]?.text}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress percentage */}
            <div className="absolute -top-8 right-0 text-sm text-slate-400">
              {Math.round(progress)}%
            </div>
          </div>
        </div>

        {/* Loading dots */}
        <div className="mt-8 flex justify-center gap-1 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Footer text */}
        <div className="mt-8 text-slate-500 text-sm animate-fade-in" style={{ animationDelay: '0.8s' }}>
          Powered by OpenSky Network
        </div>
      </div>
    </div>
  )
}
