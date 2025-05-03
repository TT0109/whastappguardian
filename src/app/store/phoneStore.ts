import { create } from 'zustand'
import { Whatsapp } from '@/services/whatsapp/whatsapp.service'


interface PhoneState {
  phoneNumber: string
  username: string
  setPhoneNumber: (phoneNumber: string) => void
  setUsername: (username: string) => void
  getWhatsappNumberInfo: (phoneNumber: string) => Promise<any>
  userInfo: any | null
  profileImage: string
  setProfileImage: (image: string) => void
}

export const usePhoneStore = create<PhoneState>((set) => ({
  phoneNumber: '',
  username: '@sorteio_me_1',
  profileImage: '',
  setPhoneNumber: (phoneNumber) => set({ phoneNumber }),
  setUsername: (username) => set({ username }),
  getWhatsappNumberInfo: async (phoneNumber: string) => {

    try {
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      const parsedNumber = cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;

      const whatsapp = new Whatsapp();
      const whatsappInfo = await whatsapp.getUserInfo(parsedNumber);
      set({ userInfo: whatsappInfo });
      return whatsappInfo;
    } catch (error) { 
      set({ phoneNumber: phoneNumber });
    }

  },
  userInfo: null,
  setProfileImage: (image: string) => set({ profileImage: image })
}))
