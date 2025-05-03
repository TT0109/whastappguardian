'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import './ProfileMonitor.css'
import { useRouter } from 'next/navigation'
import { usePhoneStore } from '../store/phoneStore'
import SmartPlayerVideo from './SmartPlayerVideo'
import { usePromotion } from './PromotionContext'

export default function ProfileMonitor() {
  const router = useRouter()
  const { profileImage } = usePhoneStore()
  const { startPromotion, stopPromotion } = usePromotion()
  const [progress, setProgress] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const videoFinishedRef = useRef(false)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const [showCtaButton, setShowCtaButton] = useState(false)
  const [processingStatus, setProcessingStatus] = useState('Processando...')
  const [showResults, setShowResults] = useState(false)
  const [suspiciousMessages, setSuspiciousMessages] = useState(0)
  const [suspiciousPhotos, setSuspiciousPhotos] = useState(0)
  const [suspiciousLocations, setSuspiciousLocations] = useState(0)
  const [videoEnded, setVideoEnded] = useState(false)
  const [redirectTriggered, setRedirectTriggered] = useState(false)
  const [videoTotalTime, setVideoTotalTime] = useState(0)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [showCTA, setShowCTA] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const ctaRef = useRef<HTMLDivElement>(null)

  // Show results after specific time or when video ends
  const handleShowResults = useCallback(() => {
    setShowResults(true);
    setSuspiciousMessages(5);
    setSuspiciousPhotos(7);
    setSuspiciousLocations(2);
    setProcessingStatus('Análise concluída!');
    setShowCtaButton(true);
  }, [])  // Empty dependency array since these setters don't change
  
  // Handle video end event
  const handleVideoEnd = () => {
    console.log('Video ended event received in ProfileMonitor')
    setVideoEnded(true)
    setShowCTA(true)
    // Não iniciar o contador de promoção aqui, apenas quando faltar 4:30
    // Scroll to CTA button
    setTimeout(() => {
      if (ctaRef.current) {
        ctaRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }, 500)
  }
  
  // Handle video progress updates
  const handleVideoProgress = (progressValue: number) => {
    setProgress(progressValue)
    
    // Update video time if we have total duration
    if (videoTotalTime > 0) {
      const currentTime = (progressValue / 100) * videoTotalTime
      setVideoCurrentTime(currentTime)
      
      // Calcular tempo restante em minutos e segundos
      const remainingTime = (videoTotalTime - currentTime) / 60
      const remainingSeconds = (videoTotalTime - currentTime)
      
      console.log(`Tempo restante: ${remainingSeconds.toFixed(1)} segundos (${remainingTime.toFixed(2)} minutos)`)
      
      // Mostrar CTA quando faltarem 5 minutos ou menos para o fim do vídeo
      if (remainingTime <= 5 && !showCTA) {
        console.log('Faltam 5 minutos ou menos, mostrando CTA')
        setShowCTA(true)
        handleShowResults() // Mostrar os resultados
        
        // Scroll para o CTA button
        setTimeout(() => {
          if (ctaRef.current) {
            ctaRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        }, 1000)
      }
      
      // Verificar se faltam aproximadamente 4:30 minutos (entre 269 e 271 segundos)
      // Usamos uma janela pequena para garantir que não ativamos várias vezes
      if (remainingSeconds <= 271 && remainingSeconds >= 269) {
        console.log(`*** INICIANDO PROMOÇÃO *** Faltam exatamente 4:30 minutos (${Math.floor(remainingSeconds)} segundos)`)
        
        // Limpar completamente qualquer estado anterior da promoção
        localStorage.removeItem('promotionActive')
        localStorage.removeItem('promotionEndTime')
        localStorage.removeItem('promotionStarted')
        
        // Pequeno delay para garantir que o timer seja reiniciado corretamente
        setTimeout(() => {
          // Iniciar a promoção com 10 minutos
          startPromotion()
          console.log('Promoção ativada com 10 minutos de tempo')
        }, 100)
      }
      
      // Se o usuário voltar o vídeo para antes de 6 minutos do final, esconder o CTA e os resultados
      if (remainingTime > 6 && showCTA) {
        console.log('Voltou para antes de 6 minutos, escondendo CTA e resultados')
        setShowCTA(false)
        setShowResults(false)
        setShowCtaButton(false)
        setProcessingStatus('Processando...')
        stopPromotion() // Parar o contador de promoção
        localStorage.removeItem('promotionStarted') // Permitir que o contador seja iniciado novamente
      }
      
      // Se o usuário voltar o vídeo para 10 minutos ou mais do final, esconder o contador de promoção
      if (remainingTime >= 10) {
        console.log('Voltou para 10 minutos ou mais, escondendo contador de promoção')
        localStorage.setItem('promotionActive', 'false')
        localStorage.removeItem('promotionStarted') // Permitir que o contador seja iniciado novamente
        stopPromotion() // Parar o contador de promoção
      }
    }
  }
  
  // Update time remaining
  useEffect(() => {
    if (videoTotalTime > 0) {
      const remaining = Math.max(0, Math.floor(videoTotalTime - videoCurrentTime))
      setTimeRemaining(remaining)
      
      // Verificar se faltam 5 minutos (300 segundos) para o fim do vídeo
      if (remaining <= 300 && !showCTA) {
        console.log(`Faltam ${remaining} segundos, mostrando CTA`)
        setShowCTA(true)
        handleShowResults() // Mostrar os resultados
        
        // Scroll para o CTA button
        setTimeout(() => {
          if (ctaRef.current) {
            ctaRef.current.scrollIntoView({ behavior: 'smooth' })
          }
        }, 1000)
      }
      
      // Já estamos verificando no handleVideoProgress, não precisamos verificar aqui novamente
      
      // Se o usuário voltar o vídeo para antes de 6 minutos (360 segundos) do final, esconder o CTA e os resultados
      if (remaining > 360 && showCTA) {
        console.log(`Voltou para ${remaining} segundos, escondendo CTA e resultados`)
        setShowCTA(false)
        setShowResults(false)
        setShowCtaButton(false)
        setProcessingStatus('Processando...')
        stopPromotion() // Parar o contador de promoção
        localStorage.removeItem('promotionStarted') // Permitir que o contador seja iniciado novamente
      }
      
      // Se o usuário voltar o vídeo para 10 minutos (600 segundos) ou mais do final, esconder o contador de promoção
      if (remaining >= 600) {
        console.log(`Voltou para ${remaining} segundos (10+ minutos), escondendo contador de promoção`)
        localStorage.setItem('promotionActive', 'false')
        localStorage.removeItem('promotionStarted') // Permitir que o contador seja iniciado novamente
        stopPromotion() // Parar o contador de promoção
      }
    }
  }, [videoCurrentTime, videoTotalTime, showCTA, handleShowResults, startPromotion, stopPromotion])
  
  // Handle redirect countdown
  useEffect(() => {
    if (redirectCountdown === null) return;
    
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      // When countdown reaches zero, show the CTA button
      setShowCtaButton(true);
      setProcessingStatus('Verificando as mensagens...');
      
      // If video has ended and we haven't triggered redirect yet
      if (videoEnded && !redirectTriggered) {
        setRedirectTriggered(true);

        setTimeout(() => {
          router.push('/whatsapp');
        }, 3000);
      }
    }
  }, [redirectCountdown, videoEnded, redirectTriggered, router]);

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
            {/* SmartPlayer Video Component */}
            <SmartPlayerVideo
              onVideoEnd={handleVideoEnd}
              onVideoProgress={handleVideoProgress}
              onVideoDurationChange={(duration) => {
                console.log('Video duration received in ProfileMonitor:', duration);
                setVideoTotalTime(duration);
              }}
            />
            
            {/* Loading indicator on top of the player */}
            {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div> */}
          </div>
          {/* <div className="mt-2 px-4">
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-green-600" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div> */}
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
          {videoEnded ? 'Processamento concluído!' : (
            <div className="flex items-center justify-center space-x-2">
              <span>Processando...</span>
              {timeRemaining > 0 && (
                <span className="text-pink-500 font-bold">
                  Tempo restante: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
          )}
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

        {/* CTA Button */}
        {showCTA && (
          <div 
            ref={ctaRef} 
            className="mb-8 smartplayer-scroll-event"
          >
            <button 
              onClick={() => {
                setRedirectTriggered(true);
                setTimeout(() => {
                  router.push('/whatsapp');
                }, 500);
              }}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white font-bold text-xl rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center"
            >
              <span>VERIFICAR AGORA</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="text-center text-sm text-pink-500 mt-2 animate-pulse">
              Análise completa disponível por tempo limitado!
            </div>
          </div>
        )}
        
        {/* Suspicious Data Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 text-center text-red-500">Dados suspeitos detectados:</h2>
          
          {/* Suspicious Messages */}
          <div className="bg-gray-900 rounded-lg p-4 mb-3 hover:bg-gray-800 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                <div>
                  <div className="font-bold">Mensagens suspeitas</div>
                  {showResults ? (
                    <div>
                      <div className="text-xs text-red-500 font-bold">5 mensagens suspeitas detectadas</div>
                    </div>
                  ) : (
                    <div className="text-xs text-green-700">*{processingStatus}</div>
                  )}
                </div>
              </div>
              {!showResults ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
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
                  {showResults ? (
                    <div className="text-xs text-red-500 font-bold">7 imagens suspeitas detectadas</div>
                  ) : (
                    <div className="text-xs text-green-700">*{processingStatus}</div>
                  )}
                </div>
              </div>
              {!showResults ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
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
                  {showResults ? (
                    <div className="text-xs text-red-500 font-bold">2 localizações suspeitas detectadas</div>
                  ) : (
                    <div className="text-xs text-green-700">*{processingStatus}</div>
                  )}
                </div>
              </div>
              {!showResults ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-green-500 mt-auto">
          {showResults ? (
            <span className="text-red-500 font-bold">Conteúdo suspeito detectado! Verifique agora.</span>
          ) : (
            <span>Os dados são processados em tempo real e são estritamente confidenciais</span>
          )}
        </div>
        
        {/* CTA Button */}
        {/* {showCtaButton && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => router.push('/instagram')}
              className="bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition hover:scale-105 focus:outline-none flex items-center justify-center mx-auto"
            >
              <span>VERIFICAR AGORA</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="mt-2 text-xs text-red-500 animate-pulse">Análise completa disponível por tempo limitado!</div>
          </div>
        )} */}
      </div>
    </div>
  )
}
