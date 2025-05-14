'use client'

import React, { useEffect, useState } from 'react'
import Navbar from '@/app/components/navbar'
import HackingSimulation from '@/app/components/HackingSimulation'
import { usePhoneStore } from './store/phoneStore'
import { useSearchParmsStore } from './store/searchParams';

export default function WhatsAppLoginPage() {
  const { setPhoneNumber, getWhatsappNumberInfo } = usePhoneStore()
  const [phoneNumberInput, setPhoneNumberInput] = useState('')
  const [showHackingSimulation, setShowHackingSimulation] = useState(false)
  const [selectedOption, setSelectedOption] = useState('monitorar')
  
  const setSearchParams = useSearchParmsStore(state => state.setSearchParams);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramsObject: Record<string, string> = {};
    params.forEach((value, key) => {
        paramsObject[key] = value;
    });
    setSearchParams(paramsObject);
}, [setSearchParams]);

  const formatPhoneNumber = (value: string) => {
    let digits = value.replace(/\D/g, '')
    
    if (value.includes('+55') || digits.startsWith('55')) {
      digits = digits.startsWith('55') ? digits.substring(2) : digits
    }
    
    if (digits.length === 0) {
      return ''
    } else if (digits.length <= 2) {
      return `+55 (${digits}`
    } else if (digits.length <= 7) {
      return `+55 (${digits.substring(0, 2)}) ${digits.substring(2)}`
    } else if (digits.length <= 11) {
      return `+55 (${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7)}`
    } else {
      return `+55 (${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`
    }
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value)
    setPhoneNumberInput(formattedNumber)
  }

  const handleOptionChange = (option: 'hackear' | 'monitorar' | 'recuperar') => {
    setSelectedOption(option)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPhoneNumber(phoneNumberInput)
    await getWhatsappNumberInfo(phoneNumberInput)
    setShowHackingSimulation(true)
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {showHackingSimulation ? (
        <HackingSimulation phoneNumber={phoneNumberInput} />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md flex flex-col items-center">
            {/* WhatsApp logo with gradient border */}
          <div className="w-36 h-36 rounded-full bg-gradient-to-r from-green-500 to-green-600 p-1 mb-8 shadow-lg">
            <div className="w-full h-full bg-black rounded-full flex items-center justify-center relative">
              {/* WhatsApp icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" fill="none"></path>
              </svg>
              
              {/* Lock icon overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black rounded-full w-10 h-10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#25D366" stroke="#25D366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-xl mb-6 text-center">
            Digite o <span className="text-green-500 font-bold">número de telefone</span> do WhatsApp que
            <br />deseja acessar!
          </h1>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-6">
              <input
                type="tel"
                value={phoneNumberInput}
                onChange={handlePhoneNumberChange}
                className="w-full bg-black border border-gray-700 rounded-full px-4 py-3 text-center text-lg"
                placeholder="+55 (DD) 00000-0000"
                maxLength={20}
                required
              />
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg mb-2 hover:bg-zinc-800 transition-colors">
                <input
                  type="radio"
                  id="hackear"
                  checked={selectedOption === 'hackear'}
                  onChange={() => handleOptionChange('hackear')}
                  className="w-5 h-5 mr-3 accent-green-500"
                  name="whatsappOption"
                />
                <label htmlFor="hackear" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Hackear Número
                </label>
              </div>
              
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg mb-2 hover:bg-zinc-800 transition-colors">
                <input
                  type="radio"
                  id="monitorar"
                  checked={selectedOption === 'monitorar'}
                  onChange={() => handleOptionChange('monitorar')}
                  className="w-5 h-5 mr-3 accent-green-500"
                  name="whatsappOption"
                />
                <label htmlFor="monitorar" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Monitorar Número
                </label>
              </div>
              
              <div className="flex items-center bg-zinc-900 p-3 rounded-lg hover:bg-zinc-800 transition-colors">
                <input
                  type="radio"
                  id="recuperar"
                  checked={selectedOption === 'recuperar'}
                  onChange={() => handleOptionChange('recuperar')}
                  className="w-5 h-5 mr-3 accent-green-500"
                  name="whatsappOption"
                />
                <label htmlFor="recuperar" className="text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Recuperar Número
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-full text-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-colors"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Acessar WhatsApp
              </div>
            </button>
          </form>
          </div>
        </div>
      )}
    </div>
  )
}
