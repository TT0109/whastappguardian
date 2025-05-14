'use client'

import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ChatHeader from '@/app/components/chat/ChatHeader'
import MessageList from '@/app/components/chat/MessageList'
import ChatInput from '@/app/components/chat/ChatInput'
import { useChatStore } from '@/app/store/chatStore'
import { usePayment } from '@/app/components/payment/PaymentContext'

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const chatId = params.id as string
  const { 
    contacts, 
    messages, 
    setActiveContact, 
    addMessage 
  } = useChatStore()
  const { openPaymentModal } = usePayment()
  
  const contact = contacts.find(c => c.id === chatId)
  const isLocked = contact?.isLocked || false
  const isBlurred = contact?.isBlurred || false
  
  useEffect(() => {
    if (chatId) {
      setActiveContact(chatId)
    }
  }, [chatId, setActiveContact])
  
  const contactMessages = messages[chatId] || []
  
  const handleSendMessage = (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: 'text' as const,
        content: text,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
      addMessage(chatId, newMessage)
    }
  }
  
  if (!contact) {
    router.push('/')
    return null
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <ChatHeader contact={contact} isLocked={isLocked} />
      
      <div className="flex-1 overflow-y-auto bg-[url('/chat-bg.png')] bg-repeat">
        <div className="max-w-3xl mx-auto py-4 px-4">
          <MessageList messages={contactMessages} isBlurred={isBlurred} />
        </div>
      </div>
      
      {isLocked ? (
        <>
          <ChatInput onSendMessage={handleSendMessage} isPremiumLocked={true} />
          <div className="bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-2 text-white mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Conversa bloqueada</span>
            </div>
            <button 
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={openPaymentModal}
            >
              Desbloquear com Premium
            </button>
          </div>
        </>
      ) : (
        <ChatInput onSendMessage={handleSendMessage} isPremiumLocked={false} />
      )}
    </div>
  )
}
