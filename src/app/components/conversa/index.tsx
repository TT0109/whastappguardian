'use client'

import Image from "next/image"
import Link from "next/link"
import PaymentModal from "../payment/PaymentModal"
import { usePayment } from "../payment/PaymentContext"

interface ConversaProps {
  id?: string;
  nome: string;
  mensagem: string;
  horario: string;
  numeroMensagens?: number | string;
  avatar?: string;
  isActive?: boolean;
  isLocked?: boolean;
  isBlurred?: boolean;
}

export default function Conversa({
  id = '1',
  nome,
  mensagem,
  horario,
  numeroMensagens,
  avatar = '/placeholder-avatar.png',
  isActive = false,
  isLocked = false,
  isBlurred = false,
}: ConversaProps) {
  const { openPaymentModal, closePaymentModal, isPaymentModalOpen } = usePayment();
  return (
    <>
      {isLocked ? (
        <div 
          className="block w-full" 
          onClick={openPaymentModal}
        >
          <div className={`flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-colors`}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <div className="blur-[8px]">
                  <Image 
                    src={avatar} 
                    alt={`Avatar de ${nome}`} 
                    width={48} 
                    height={48}
                    className="object-cover" 
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium blur-[8px] select-none">{nome}</span>
                <span className="text-gray-400 text-sm truncate max-w-[180px] blur-[8px] select-none">{mensagem}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-gray-400 text-xs blur-sm">{horario}</span>
              {numeroMensagens && (
                <div className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center blur-sm">
                  {numeroMensagens}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isBlurred ? (
        <Link href={`/chat/${id}`} className="block w-full">
          <div className={`flex items-center justify-between w-full p-3 rounded-lg ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer transition-colors`}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <div className="blur-[8px]">
                  <Image 
                    src={avatar} 
                    alt={`Avatar de ${nome}`} 
                    width={48} 
                    height={48}
                    className="object-cover" 
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center backdrop-blur-md rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium blur-[8px] select-none">{nome}</span>
                <span className="text-gray-400 text-sm truncate max-w-[180px] blur-[8px] select-none">{mensagem}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-gray-400 text-xs blur-sm">{horario}</span>
              {numeroMensagens && (
                <div className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center blur-sm">
                  {numeroMensagens}
                </div>
              )}
            </div>
          </div>
        </Link>
      ) : (
        <Link href={`/chat/${id}`} className="block w-full">
          <div className={`flex items-center justify-between w-full p-3 rounded-lg ${isActive ? 'bg-gray-800' : 'hover:bg-gray-800'} cursor-pointer transition-colors`}>
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image 
                  src={avatar} 
                  alt={`Avatar de ${nome}`} 
                  width={48} 
                  height={48}
                  className="object-cover" 
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-medium">{nome}</span>
                <span className="text-gray-400 text-sm truncate max-w-[180px]">{mensagem}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-gray-400 text-xs">{horario}</span>
              {numeroMensagens && (
                <div className="bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {numeroMensagens}
                </div>
              )}
            </div>
          </div>
        </Link>
      )}

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={closePaymentModal} 
        title="Contato Bloqueado" 
        description="Este contato está bloqueado. Obtenha o plano premium para continuar."
        showPlanSelector={true}
      />
    </>
  )
}
