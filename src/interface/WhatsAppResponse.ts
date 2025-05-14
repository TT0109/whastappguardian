export interface WhatsAppUserResponse {
  status: string;
  data: {
    id: string;
    phone: string;
    name?: string;
    status?: string;
    image?: string;
    lastSeen?: string;
    isOnline?: boolean;
    isBusiness?: boolean;
  };
}
