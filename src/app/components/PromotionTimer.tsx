'use client'

import React, { useState, useEffect } from 'react'

const PromotionTimer = () => {
  const [seconds, setSeconds] = useState(10 * 60)
  const [isVisible, setIsVisible] = useState(false)
  const [initialized, setInitialized] = useState(false)
  
  useEffect(() => {
    // Verificar o localStorage a cada 1 segundo
    const checkInterval = setInterval(() => {
      const promotionActive = localStorage.getItem('promotionActive')
      
      // Se a promoção foi ativada e ainda não inicializamos o timer
      if (promotionActive === 'true') {
        if (!initialized) {
          console.log('Inicializando timer com 10 minutos')
          setSeconds(10 * 60) // Forçar 10 minutos ao iniciar
          setInitialized(true)
        }
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setInitialized(false) // Reset quando a promoção for desativada
      }
    }, 1000)
    
    // Countdown timer só funciona quando estiver visível
    const countdownInterval = setInterval(() => {
      if (isVisible) {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            return 0 // Parar em zero
          }
          return prevSeconds - 1
        })
      }
    }, 1000)
    
    return () => {
      clearInterval(checkInterval)
      clearInterval(countdownInterval)
    }
  }, [isVisible, initialized])
  
  // Não renderizar se não estiver visível
  if (!isVisible) return null
  
  // Formatar o tempo restante
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  return (
    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 text-center text-sm font-bold sticky top-0 z-50 animate-pulse">
      PROMOÇÃO EXPIRA EM {minutes}:{remainingSeconds.toString().padStart(2, '0')}
    </div>
  )
}

export default PromotionTimer
