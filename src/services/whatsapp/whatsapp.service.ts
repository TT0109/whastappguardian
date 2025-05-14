import { WhatsAppUserResponse } from "@/interface/WhatsAppResponse";
import api from "@/lib/axios/whatsapp";

export default class WhatsAppService {
  private static instance: WhatsAppService;

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  async getUserInfo(whatsappNumber: string): Promise<WhatsAppUserResponse> {
    try {
      const response = await api.get(`number/${whatsappNumber}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching user info:', err);
      throw err;
    }
  }

  async checkNumberExists(whatsappNumber: string): Promise<boolean> {
    try {
      const userInfo = await this.getUserInfo(whatsappNumber);
      return userInfo.status === 'success';
    } catch (err) {
      return false;
    }
  }
}