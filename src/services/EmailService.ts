import axios from "axios";
import { IntNotificationService } from "../intefaces/services/IntNotificationService";
import { config } from "config/env";

class EmailService implements IntNotificationService {
    async sendNotification(data: {
        responsavelEmail: string;
        alunoNome: string;
        horarioInicio: string;
        horarioFim: string;
        token: string;
    }): Promise<void> {
        try {

            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            await axios.post(`${config.EMAIL_SERVICE_URL}/notify`, data);
            console.log(`E-mail de ausência enviado para o responsável de ${data.alunoNome}`);
        } catch (error) {
            console.error('Erro ao enviar e-mail de notificação:', error);
        }
    }
}

export { EmailService };