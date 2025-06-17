import { IntNotificationService } from "../intefaces/services/IntNotificationService";

class EmailService implements IntNotificationService {
    async sendNotification(message: string): Promise<void> {
        console.log('Enviando email: ', message);
    }
}

export { EmailService };