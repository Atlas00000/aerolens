"use client"

import { useState, useEffect } from "react"
import { Plane, Wifi, Globe, Zap, Satellite, Database, Shield, Rocket } from "lucide-react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [showLogo, setShowLogo] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showCompletion, setShowCompletion] = useState(false)

  const steps = [
    { icon: Globe, text: "Initializing 3D Environment", duration: 2000, color: "from-blue-500 to-cyan-500" },
    { icon: Satellite, text: "Connecting to Flight Data", duration: 1800, color: "from-purple-500 to-pink-500" },
    { icon: Database, text: "Loading Aircraft Models", duration: 1600, color: "from-green-500 to-emerald-500" },
    { icon: Shield, text: "Securing Connection", duration: 1400, color: "from-orange-500 to-red-500" },
    { icon: Rocket, text: "Optimizing Performance", duration: 1200, color: "from-indigo-500 to-purple-500" }
  ]

  useEffect(() => {
    // Staggered animation sequence
    const sequence = async () => {
      // Show logo first
      await new Promise(resolve => setTimeout(resolve, 300))
      setShowLogo(true)
      
      // Show progress after logo
      await new Promise(resolve => setTimeout(resolve, 500))
      setShowProgress(true)
      
      // Start progress animation
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
          setShowCompletion(true)
          setTimeout(() => setIsVisible(false), 800)
        }
      }, 16)
    }

    sequence()
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Logo Section */}
        <div className={`transition-all duration-1000 ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block mb-8">
            {/* Main logo container */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
              
              {/* Inner container */}
              <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Plane className="w-8 h-8 text-white animate-float" />
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-blue-500/30 rounded-full animate-ping"></div>
                </div>
              </div>
              
              {/* Orbiting elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-purple-400 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute left-0 top-1/2 w-2 h-2 bg-pink-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute right-0 top-1/2 w-2 h-2 bg-cyan-400 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
            
            {/* Logo glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-2xl animate-pulse-glow"></div>
          </div>
          
          <h1 className="text-5xl font-bold text-gradient mb-3 animate-slide-in-up">
            AeroLens
          </h1>
          <p className="text-xl text-slate-300 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            Real-time Flight Tracking
          </p>
          <p className="text-sm text-slate-500 mt-2 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            Powered by advanced satellite technology
          </p>
        </div>

        {/* Progress Section */}
        <div className={`transition-all duration-1000 delay-500 ${showProgress ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep
              const isPending = index > currentStep
              
              return (
                <div key={index} className="relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isActive 
                        ? `bg-gradient-to-r ${step.color} scale-110 animate-pulse-glow shadow-lg` 
                        : isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md' 
                        : 'glass-effect-dark border-white/10'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActive || isCompleted ? 'text-white' : 'text-slate-400'
                    }`} />
                  </div>
                  
                  {/* Connection lines */}
                  {index < steps.length - 1 && (
                    <div className={`absolute top-1/2 left-full w-8 h-0.5 transition-all duration-500 ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-white/10'
                    }`}></div>
                  )}
                  
                  {/* Step label */}
                  <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs font-medium transition-all duration-300 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}>
                    {step.text}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Current step display */}
          <div className="h-12 mb-6 flex items-center justify-center">
            <div className={`text-center transition-all duration-500 ${showCompletion ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
              <p className="text-white font-medium text-lg mb-1">
                {steps[currentStep]?.text}
              </p>
              <p className="text-slate-400 text-sm">
                Step {currentStep + 1} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="relative mb-8">
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className={`h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out relative ${
                  showCompletion ? 'animate-pulse' : ''
                }`}
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
            
            {/* Progress percentage */}
            <div className="absolute -top-8 right-0 text-sm text-slate-400 font-mono">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Loading animation */}
          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  showCompletion 
                    ? 'bg-green-400 animate-pulse' 
                    : 'bg-blue-500 animate-pulse'
                }`}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Completion message */}
        <div className={`transition-all duration-500 ${showCompletion ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Ready for Takeoff!</h3>
            <p className="text-slate-400">Initialization complete</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-slate-600 text-sm animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center justify-center gap-4">
            <span>Powered by OpenSky Network</span>
            <span>•</span>
            <span>Real-time Data</span>
            <span>•</span>
            <span>Global Coverage</span>
          </div>
        </div>
      </div>
    </div>
  )
}
