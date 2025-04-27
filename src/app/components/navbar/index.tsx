'use client'

import React from 'react'
import Link from 'next/link'
import { usePayment } from '../payment/PaymentContext'
import PaymentModal from '../payment/PaymentModal'

interface NavbarItemProps {
  icon: 'refresh' | 'phone' | 'users' | 'message-circle' | 'settings' | 'instagram'
  label: string
  isActive?: boolean
  badgeCount?: number
  href?: string
  isPremium?: boolean
  onClick?: () => void
}

function NavbarItem({ 
  icon, 
  label, 
  isActive = false,
  badgeCount,
  href,
  isPremium = false,
  onClick
}: NavbarItemProps) {
  const content = (
    <div className="flex flex-col items-center justify-center py-2">

      <div className="relative">
        <div className={`p-2 rounded-full ${isActive ? 'text-white' : 'text-gray-500'}`}>
          {icon === 'refresh' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
          )}
          {icon === 'message-circle' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
          {icon === 'phone' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
          )}
          {icon === 'settings' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          )}
          {icon === 'instagram' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          )}
          {icon === 'users' && (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          )}
        </div>
        
        {badgeCount && (
          <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badgeCount > 99 ? '99+' : badgeCount}
          </div>
        )}
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  )
  
  if (isPremium) {
    return (
      <div className="flex-1 cursor-pointer" onClick={onClick}>
        {content}
      </div>
    )
  }
  
  return href ? (
    <Link href={href} className="flex-1">
      {content}
    </Link>
  ) : (
    <div className="flex-1">
      {content}
    </div>
  )
}

interface NavbarProps {
  activeItem?: 'conversas' | 'atualizacoes' | 'ligacoes' | 'comunidades' | 'configuracoes'
}

export default function Navbar({ activeItem = 'conversas' }: NavbarProps) {
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment();
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800">
        <div className="flex justify-around items-center w-full">
          <NavbarItem 
            icon="message-circle" 
            label="Conversas" 
            isActive={activeItem === 'conversas'} 
            badgeCount={52}
            href="/whatsapp"
          />
          <NavbarItem 
            icon="phone" 
            label="Ligações" 
            isActive={activeItem === 'ligacoes'} 
            badgeCount={1}
            isPremium={true}
            onClick={openPaymentModal}
          />
          <NavbarItem 
            icon="users" 
            label="Comunidades" 
            isActive={activeItem === 'comunidades'} 
            isPremium={true}
            onClick={openPaymentModal}
          />
          <NavbarItem 
            icon="refresh" 
            label="Atualizações" 
            isActive={activeItem === 'atualizacoes'} 
            href="/atualizacoes"
          />
          <NavbarItem 
            icon="settings" 
            label="Configurações" 
            isActive={activeItem === 'configuracoes'} 
            href="/configuracoes"
          />
        </div>
        <div className="h-1 w-full">
          <div className="h-full bg-white w-1/5 transform translate-x-full scale-x-3"></div>
        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal} 
        title="Recurso Bloqueado" 
        description="Este recurso está bloqueado. Obtenha o plano premium para continuar."
        showPlanSelector={true}
      />
    </>
  )
}
