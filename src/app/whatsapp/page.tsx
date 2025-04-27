"use client";

import Arquivadas from "../components/arquivadas";
import AutoNotifications from "../components/AutoNotifications";
import Conversa from "../components/conversa";
import Filtros from "../components/filtros";
import Header from "../components/header";
import Navbar from "../components/navbar";
import { useChatStore } from "../store/chatStore";

export default function Home() {
  const { contacts } = useChatStore();
  
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 pb-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Header title="Conversas" />
        <Filtros activeFilter="todas" naoLidasCount={53} arquivadasCount={2} />
        
        <Arquivadas count={2} />
        
        <div className="space-y-2">
          {contacts.map((contact) => (
            <Conversa
              key={contact.id}
              id={contact.id}
              nome={contact.nome}
              mensagem={contact.lastMessage || ""}
              horario={contact.lastMessageTime || ""}
              numeroMensagens={contact.unreadCount}
              avatar={contact.avatar}
              isLocked={contact.isLocked}
              isBlurred={contact.isBlurred}
            />
          ))}
        </div>
      </div>
      <AutoNotifications />
      <Navbar activeItem="conversas" />
    </div>
  );
}
  