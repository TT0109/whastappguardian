import { create } from 'zustand'

// Types for the chat store
export interface Contact {
  id: string
  nome: string
  avatar: string
  online: boolean
  lastMessage: string
  lastMessageTime: string
  unreadCount?: number | string
  isLocked?: boolean
  isBlurred?: boolean
}

export interface Message {
  id: string
  type: 'text' | 'audio' | 'image' | 'missed-call'
  content: string
  sender: 'me' | 'them'
  time: string
  reactions?: string[]
  duration?: string // For audio messages
  senderAvatar?: string // For showing avatar in messages
}

interface ChatState {
  contacts: Contact[]
  activeContactId?: string
  messages: Record<string, Message[]>
  setActiveContact: (contactId: string) => void
  addMessage: (contactId: string, message: Message) => void
  updateUnreadCount: (contactId: string, count: number | string) => void
  playNotificationSound: () => void
}

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

// Mock data for initial state
const mockContacts: Contact[] = [
  {
    id: '1',
    nome: 'Vitória',
    avatar: 'https://i.pravatar.cc/150?img=5',
    online: true,
    lastMessage: 'Hmm',
    lastMessageTime: '19:47',
    isBlurred: true
  },
  {
    id: '2',
    nome: `Cidade de ${randomCity()}`,
    avatar: 'https://i.pravatar.cc/150?img=3',
    online: false,
    lastMessage: 'Preciso de um ajudante para serviço d...',
    lastMessageTime: '19:47',
    unreadCount: 'Mais de 999',
    isBlurred: true
  },
  {
    id: '3',
    nome: 'Nome do contato',
    avatar: 'https://i.pravatar.cc/150?img=8',
    online: true,
    lastMessage: 'https://www.familhao.com/inicio?',
    lastMessageTime: '19:46',
    unreadCount: 1,
    isLocked: true
  },
  {
    id: '4',
    nome: 'Grupo da Família',
    avatar: 'https://i.pravatar.cc/150?img=2',
    online: false,
    lastMessage: 'João: Alguém vai no aniversário?',
    lastMessageTime: '19:40',
    unreadCount: 5,
    isLocked: true
  },
  {
    id: '5',
    nome: 'Maria do Trabalho',
    avatar: 'https://i.pravatar.cc/150?img=4',
    online: true,
    lastMessage: 'Você viu o email que te enviei?',
    lastMessageTime: '19:30',
    isLocked: true,
  },
  {
    id: '6',
    nome: 'Pedro Academia',
    avatar: 'https://i.pravatar.cc/150?img=7',
    online: false,
    lastMessage: 'Amanhã tem treino especial!',
    lastMessageTime: '18:55',
    unreadCount: 2,
    isLocked: true
  },
  {
    id: '7',
    nome: 'Entrega Mercado',
    avatar: 'https://i.pravatar.cc/150?img=9',
    online: false,
    lastMessage: 'Sua entrega está a caminho',
    lastMessageTime: '18:30',
    isLocked: true
  }
]

// Mock messages for each contact
const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: '1', type: 'text', content: 'Vocês não tem bom senso kk', sender: 'them', time: '19:10', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '2', type: 'text', content: 'Kkkkkkkkk eu tenho', sender: 'me', time: '19:11' },
    { id: '3', type: 'text', content: 'É nada', sender: 'them', time: '19:12', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '4', type: 'text', content: 'Vocês sempre largam uma linda para querer uma smiliguida', sender: 'them', time: '19:13', senderAvatar: 'https://i.pravatar.cc/150?img=5', reactions: ['👍', '😂'] },
    { id: '5', type: 'text', content: 'Óbvia que ele ia pegar a fêmea errada', sender: 'me', time: '19:46' },
    { id: '6', type: 'audio', content: '/audio/message1.mp3', sender: 'them', time: '19:46', duration: '0:01', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '7', type: 'text', content: 'O Joe pegando a irmã errada', sender: 'me', time: '19:47' },
    { id: '8', type: 'text', content: 'Kkkk ah tá', sender: 'them', time: '19:47', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '9', type: 'image', content: '/images.jpeg', sender: 'them', time: '19:47', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '10', type: 'text', content: 'De boa', sender: 'me', time: '19:47', reactions: ['👍'] },
    { id: '11', type: 'text', content: 'No padrão das outras', sender: 'me', time: '19:47' },
    { id: '12', type: 'text', content: 'Hmm', sender: 'them', time: '19:47', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '13', type: 'missed-call', content: 'Chamada de voz perdida', sender: 'them', time: '19:49', senderAvatar: 'https://i.pravatar.cc/150?img=5' },
  ],
  '2': [
    { id: '1', type: 'text', content: 'Olá, tudo bem?', sender: 'them', time: '19:40', senderAvatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '2', type: 'text', content: 'Preciso de um ajudante para serviço de entrega', sender: 'them', time: '19:41', senderAvatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '3', type: 'text', content: 'Qual o valor do pagamento?', sender: 'me', time: '19:42' },
    { id: '4', type: 'text', content: 'R$ 150 por dia', sender: 'them', time: '19:43', senderAvatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '5', type: 'text', content: 'Vou pensar e te aviso', sender: 'me', time: '19:45' },
    { id: '6', type: 'audio', content: '/audio/message2.mp3', sender: 'them', time: '19:47', duration: '0:04', senderAvatar: 'https://i.pravatar.cc/150?img=3' },
    { id: '7', type: 'image', content: '/mapa.jpg', sender: 'them', time: '19:48', senderAvatar: 'https://i.pravatar.cc/150?img=3' },
  ],
  '3': [
    { id: '1', type: 'text', content: 'Ei, viu esse site?', sender: 'them', time: '19:40', senderAvatar: 'https://i.pravatar.cc/150?img=8' },
    { id: '2', type: 'text', content: 'https://www.familhao.com/inicio?', sender: 'them', time: '19:46', senderAvatar: 'https://i.pravatar.cc/150?img=8' },
    { id: '3', type: 'text', content: 'Ainda não, vou olhar', sender: 'me', time: '19:46' },
    { id: '4', type: 'image', content: '/mapa.jpg', sender: 'them', time: '19:48', senderAvatar: 'https://i.pravatar.cc/150?img=8' },
  ],
  '4': [
    { id: '1', type: 'text', content: 'Olá pessoal!', sender: 'them', time: '19:30', senderAvatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '2', type: 'text', content: 'Alguém vai no aniversário?', sender: 'them', time: '19:35', senderAvatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', type: 'text', content: 'Eu vou!', sender: 'me', time: '19:36' },
    { id: '4', type: 'text', content: 'Que horas começa?', sender: 'me', time: '19:37' },
    { id: '5', type: 'text', content: 'Às 20h', sender: 'them', time: '19:40', senderAvatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '6', type: 'audio', content: '/audio/message3.mp3', sender: 'them', time: '19:41', duration: '0:03', senderAvatar: 'https://i.pravatar.cc/150?img=2' },
  ],
  '5': [
    { id: '1', type: 'text', content: 'Bom dia!', sender: 'them', time: '09:30', senderAvatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '2', type: 'text', content: 'Você viu o email que te enviei?', sender: 'them', time: '19:30', senderAvatar: 'https://i.pravatar.cc/150?img=4' },
    { id: '3', type: 'missed-call', content: 'Chamada de voz perdida', sender: 'them', time: '19:32', senderAvatar: 'https://i.pravatar.cc/150?img=4' },
  ],
  '6': [
    { id: '1', type: 'text', content: 'Olá! Tudo bem?', sender: 'them', time: '18:50', senderAvatar: 'https://i.pravatar.cc/150?img=7' },
    { id: '2', type: 'text', content: 'Amanhã tem treino especial!', sender: 'them', time: '18:55', senderAvatar: 'https://i.pravatar.cc/150?img=7' },
    { id: '3', type: 'image', content: 'https://i.pravatar.cc/300?img=12', sender: 'them', time: '18:56', senderAvatar: 'https://i.pravatar.cc/150?img=7' },
  ],
  '7': [
    { id: '1', type: 'text', content: 'Sua entrega está a caminho', sender: 'them', time: '18:30', senderAvatar: 'https://i.pravatar.cc/150?img=9' },
    { id: '2', type: 'text', content: 'Chegará em aproximadamente 30 minutos', sender: 'them', time: '18:30', senderAvatar: 'https://i.pravatar.cc/150?img=9' },
    { id: '3', type: 'audio', content: '/audio/message4.mp3', sender: 'them', time: '18:32', duration: '0:02', senderAvatar: 'https://i.pravatar.cc/150?img=9' },
  ]
}

export const useChatStore = create<ChatState>((set) => ({
  contacts: mockContacts,
  messages: mockMessages,
  setActiveContact: (contactId) => {
    set({ activeContactId: contactId })
    
    // Clear unread count when selecting a contact
    set((state) => ({
      contacts: state.contacts.map(contact => 
        contact.id === contactId 
          ? { ...contact, unreadCount: undefined } 
          : contact
      )
    }))
  },
  addMessage: (contactId, message) => {
    set((state) => {
      const contactMessages = state.messages[contactId] || []
      
      // Update the contact's last message and time
      const updatedContacts = state.contacts.map(contact => {
        if (contact.id === contactId) {
          return {
            ...contact,
            lastMessage: message.content,
            lastMessageTime: message.time,
            // If the message is from them and we're not on their chat, increment unread
            unreadCount: message.sender === 'them' && state.activeContactId !== contactId
              ? (typeof contact.unreadCount === 'number' 
                  ? (contact.unreadCount as number) + 1
                  : 1)
              : contact.unreadCount
          }
        }
        return contact
      })
      
      // Play notification sound if the message is from them
      if (message.sender === 'them' && state.activeContactId !== contactId) {
        const audio = new Audio('/som/notificacao.mp3')
        audio.play().catch(e => console.error('Error playing notification:', e))
      }
      
      return {
        contacts: updatedContacts,
        messages: {
          ...state.messages,
          [contactId]: [...contactMessages, message]
        }
      }
    })
  },
  updateUnreadCount: (contactId, count) => {
    set((state) => {
      // Get the current unread count
      const contact = state.contacts.find(c => c.id === contactId)
      const currentCount = contact?.unreadCount
      
      // Only play sound if count is increasing
      if (
        (typeof currentCount === 'number' && typeof count === 'number' && count > currentCount) ||
        (currentCount === undefined && count !== undefined)
      ) {
        const audio = new Audio('/som/notificacao.mp3')
        audio.play().catch(e => console.error('Error playing notification:', e))
      }
      
      return {
        contacts: state.contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, unreadCount: count } 
            : contact
        )
      }
    })
  },
  playNotificationSound: () => {
    const audio = new Audio('/som/notificacao.mp3')
    audio.play().catch(e => console.error('Error playing notification:', e))
  }
}))
