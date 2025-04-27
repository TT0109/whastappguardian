'use client'

import React from 'react'
import { usePayment, PlanType } from './PaymentContext'

interface PaymentSectionProps {
  title?: string
  description?: string
  showPlanSelector?: boolean
  variant?: 'default' | 'compact'
  icon?: 'lock' | 'star' | 'crown'
}

export default function PaymentSection({
  title = "Conta privada",
  description = "Este perfil é privado obtenha acesso premium para ter acesso completo ao perfil.",
  showPlanSelector = true,
  variant = 'default',
  icon = 'lock'
}: PaymentSectionProps) {
  const { prices, selectedPlan, setSelectedPlan, processPayment } = usePayment()
  
  const handlePlanChange = (plan: PlanType) => {
    setSelectedPlan(plan)
  }
  
  const currentPrice = selectedPlan === 'monthly' ? prices.monthly : prices.yearly
  const period = selectedPlan === 'monthly' ? '/mês' : '/ano'
  
  // Ícones disponíveis
  const icons = {
    lock: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
    star: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    ),
    crown: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path>
      </svg>
    )
  }
  
  return (
    <div className={`flex flex-col items-center ${variant === 'default' ? 'bg-zinc-900' : 'bg-gradient-to-r from-zinc-900 to-zinc-800'} rounded-lg py-8 px-4 mt-4 text-center`}>
      {/* Ícone */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-full p-4 mb-6 text-white">
        {icons[icon]}
      </div>
      
      {/* Título */}
      <h2 className="text-white text-xl font-medium mb-3">{title}</h2>
      
      {/* Descrição */}
      <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
        {description}
      </p>
      
      {/* Seletor de plano */}
      {showPlanSelector && (
        <div className="bg-zinc-800 rounded-lg p-3 mb-6 w-full max-w-xs">
          <div className="flex justify-between items-center">
            <div className="flex-1 text-center">
              <button 
                className={`w-full py-2 rounded-lg transition-colors ${
                  selectedPlan === 'monthly' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                    : 'bg-zinc-700 text-gray-400'
                }`}
                onClick={() => handlePlanChange('monthly')}
              >
                Mensal
              </button>
            </div>
            <div className="flex-1 text-center">
              <button 
                className={`w-full py-2 rounded-lg transition-colors ${
                  selectedPlan === 'yearly' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' 
                    : 'bg-zinc-700 text-gray-400'
                }`}
                onClick={() => handlePlanChange('yearly')}
              >
                Anual
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Preço */}
      <div className="mb-6">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-2xl font-bold">
          {currentPrice}
        </span>
        <span className="text-gray-400 text-sm">{period}</span>
      </div>
      
      {/* Botão de acesso */}
      <button 
        onClick={processPayment}
        className="w-full max-w-xs py-3 rounded-full text-white font-medium transition-colors bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
      >
        Obter acesso completo
      </button>
      
      {/* Lista de benefícios (apenas para variante padrão) */}
      {variant === 'default' && (
        <div className="mt-6 w-full max-w-xs">
          <ul className="text-left text-gray-300 space-y-2">
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Acesso a todos os recursos</span>
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Ligações ilimitadas</span>
            </li>
            <li className="flex items-center">
              <svg className="text-purple-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Sem anúncios</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
