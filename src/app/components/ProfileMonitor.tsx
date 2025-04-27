'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import './ProfileMonitor.css'
import { useRouter } from 'next/navigation'
import { usePhoneStore } from '../store/phoneStore'

export default function ProfileMonitor() {
  const router = useRouter()
  const { profileImage } = usePhoneStore()
  const [progress, setProgress] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [redirectTriggered, setRedirectTriggered] = useState(false)

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100 && !redirectTriggered) {
          clearInterval(progressInterval)
          setRedirectTriggered(true)
          return 100
        }
        return prev + 0.3
      })
    }, 50)

    return () => {
      clearInterval(progressInterval)
    }
  }, [redirectTriggered])
  
  // Separate effect for redirection to avoid loop
  useEffect(() => {
    if (redirectTriggered) {
      const redirectTimer = setTimeout(() => {
        router.push('/whatsapp/')
      }, 3000)
      
      return () => clearTimeout(redirectTimer)
    }
  }, [redirectTriggered, router])

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex-1 flex flex-col p-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-green-500">Assista o video enquanto</h1>
          <h2 className="text-4xl font-bold text-white">o perfil é rastreado</h2>
          <p className="text-gray-400 mt-1">e as conversas são processadas</p>
        </div>

        {/* Video Player */}
        <div className="relative w-full rounded-xl overflow-hidden border-2 border-gradient-to-r from-green-400 to-green-600 mb-6">
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="relative w-full h-full">
              <Image 
                src="/video-thumbnail.jpg" 
                alt="Video Thumbnail" 
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/640x360/1e1e1e/ffffff?text=Video+Thumbnail";
                }}
              />
            </div>
            {!isVideoPlaying && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-white opacity-80" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
            <div className="flex items-center">
              <button 
                onClick={toggleVideo}
                className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center mr-2"
              >
                {isVideoPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              <div className="flex-1">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Image with wave animation */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {/* Animated waves */}
            <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-green-500 pulse-animation"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-green-500 wave-animation"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-green-500 wave-animation-delay-1"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-green-500 wave-animation-delay-2"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-green-500 wave-animation-delay-3"></div>
            <div className="absolute inset-0 w-20 h-20 rounded-full border border-green-500 wave-animation-delay-4"></div>
            
            {/* Profile image */}
            <div className="relative w-20 h-20 rounded-full border-2 border-green-500 p-0.5 z-10">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <Image 
                    src={profileImage || "/whatsapp-default-profile.jpg"} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/whatsapp-default-profile.jpg";
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="absolute bottom-[-12px] left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-4 py-1 rounded-full flex items-center gap-1 z-20 shadow-lg border border-black whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="font-medium">Monitorando</span>
            </div>
          </div>
        </div>

        {/* Processing Status */}
        <div className="text-gray-400 text-center mb-2">
          Processando...
        </div>

        {/* Progress Bar */}
        <div className="w-full mb-8">
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Suspicious Data Section */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-4 text-green-500">Dados suspeitos detectados:</h3>
          
          {/* Suspicious Messages */}
          <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div>
                  <div className="font-bold">Mensagens suspeitas</div>
                  <div className="text-xs text-green-700">*Analisando conversas e mensagens diretas...</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          
          {/* Suspicious Images */}
          <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-bold">Imagens suspeitas</div>
                  <div className="text-xs text-green-700">*Verificando conteúdo de imagens compartilhadas...</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
          
          {/* Suspicious Locations */}
          <div className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="font-bold">Localizações suspeitas</div>
                  <div className="text-xs text-green-700">*Analisando dados de localização...</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-green-500 mt-auto">
          Os dados são processados em tempo real e são estritamente confidenciais
        </div>
      </div>
    </div>
  )
}
