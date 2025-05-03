'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

interface PromotionContextType {
  showPromotion: boolean
  startPromotion: () => void
  stopPromotion: () => void
}

const PromotionContext = createContext<PromotionContextType>({
  showPromotion: false,
  startPromotion: () => {},
  stopPromotion: () => {}
})

export const usePromotion = () => useContext(PromotionContext)

export const PromotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showPromotion, setShowPromotion] = useState(false)
  
  // Verificar se a promoção já foi iniciada anteriormente
  useEffect(() => {
    // Limpar qualquer promoção anterior ao carregar a página
    localStorage.removeItem('promotionActive')
    localStorage.removeItem('promotionEndTime')
    localStorage.removeItem('promotionStarted')
    setShowPromotion(false)
  }, [])
  
  const startPromotion = () => {
    console.log('Iniciando promoção...')
    
    // Primeiro limpar qualquer estado anterior
    localStorage.removeItem('promotionEndTime')
    localStorage.removeItem('promotionStarted')
    
    // Agora ativar a promoção
    setShowPromotion(true)
    localStorage.setItem('promotionActive', 'true')
    localStorage.setItem('promotionStarted', 'true')
    
    console.log('Promoção ativada com sucesso!')
  }
  
  const stopPromotion = () => {
    setShowPromotion(false)
    localStorage.removeItem('promotionActive')
    localStorage.removeItem('promotionEndTime')
  }
  
  return (
    <PromotionContext.Provider value={{ showPromotion, startPromotion, stopPromotion }}>
      {children}
    </PromotionContext.Provider>
  )
}

export default PromotionContext
