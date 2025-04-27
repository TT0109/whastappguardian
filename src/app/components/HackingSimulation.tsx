'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface HackingStep {
  message: string
  delay: number
  isError?: boolean
}

export default function HackingSimulation({ phoneNumber }: { phoneNumber: string }) {
  const router = useRouter()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Define the hacking steps with their messages and delays

  const randomCity = () => {
    const cities = [
      'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Salvador',
      'Fortaleza', 'Curitiba', 'Manaus', 'Recife', 'Porto Alegre',
      'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
      'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Natal', 'Teresina',
      'Nova Iguaçu', 'São Bernardo do Campo', 'João Pessoa', 'Campo Grande', 'Santo André',
      'Osasco', 'Jaboatão dos Guararapes', 'Contagem', 'Ribeirão Preto', 'Uberlândia',
      'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Aparecida de Goiânia',
      'Londrina', 'Juiz de Fora', 'Ananindeua', 'Niterói', 'Belford Roxo',
      'Serra', 'Caxias do Sul', 'Macapá', 'São João de Meriti', 'Florianópolis',
      'Vila Velha', 'Mauá', 'São José dos Campos', 'Mogi das Cruzes', 'Santos',
      'Betim', 'Diadema', 'Campina Grande', 'Carapicuíba', 'Olinda',
      'Franca', 'Blumenau', 'Petrolina', 'Ponta Grossa', 'Boa Vista'
    ];
    return cities[Math.floor(Math.random() * cities.length)];
  }
  

  const hackingSteps = useMemo<HackingStep[]>(() => [
    { message: `Connecting to WhatsApp server...`, delay: 1500 },
    { message: `Erro 305, tentando novamente...`, delay: 2000, isError: true },
    { message: `Simulating IP in the region of ${randomCity()}...`, delay: 2500 },
    { message: `Bypassing firewall...`, delay: 1800 },
    { message: `Injecting SQL queries...`, delay: 2200 },
    { message: `Fetching information from ${phoneNumber}...`, delay: 2000 },
    { message: `Cracking password...`, delay: 3000 },
    { message: `Erro 305, tentando novamente...`, delay: 1500, isError: true },
    { message: `Authenticating as ${phoneNumber}...`, delay: 2500 },
    { message: `Access granted, redirecting to the requested server...`, delay: 2000 }
  ], [phoneNumber])

  useEffect(() => {
    // Start the hacking simulation
    let totalTime = 0
    
    // Set up progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1
      })
    }, 200)

    // Set up the sequence of messages
    hackingSteps.forEach((step, index) => {
      totalTime += step.delay
      
      setTimeout(() => {
        setCurrentStepIndex(index + 1)
        
        // When we reach the last step, wait a bit and then redirect
        if (index === hackingSteps.length - 1) {
          setTimeout(() => {
            setIsComplete(true)
            clearInterval(progressInterval)
            setProgress(100)
            
            // Redirect to the scan page after completion
            setTimeout(() => {
              router.push('/whatsapp/scan')
            }, 1000)
          }, 1000)
        }
      }, totalTime)
    })

    return () => {
      clearInterval(progressInterval)
    }
  }, [router, hackingSteps])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center p-6 z-50">
      {/* Logo */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 p-1 mb-8 shadow-lg">
        <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none"></path>
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black rounded-full w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#25D366" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Target info */}
      <div className="mb-8 text-center">
        <h2 className="text-xl text-white mb-2">
          Acessando número <span className="text-green-500 font-bold">{phoneNumber}</span>
        </h2>
        <p className="text-gray-400">Por favor, aguarde enquanto processamos sua solicitação</p>
      </div>
      
      {/* Progress bar */}
      <div className="w-full max-w-md h-2 bg-zinc-800 rounded-full mb-8 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-green-500 to-green-400"
          style={{ width: `${progress}%`, transition: 'width 0.2s ease-in-out' }}
        ></div>
      </div>
      
      {/* Status messages */}
      <div className="w-full max-w-md h-64 overflow-y-auto bg-zinc-900 rounded-lg p-4 font-mono text-sm">
        {hackingSteps.slice(0, currentStepIndex).map((step, index) => (
          <div key={index} className={`mb-2 ${step.isError ? 'text-red-500' : 'text-green-400'}`}>
            • {step.message}
          </div>
        ))}
        
        {isComplete && (
          <div className="text-white mt-4 font-bold">
            Processo concluído com sucesso!
          </div>
        )}
      </div>
    </div>
  )
}
