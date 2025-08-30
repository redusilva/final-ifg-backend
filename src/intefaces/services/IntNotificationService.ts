export interface IntNotificationService {
    sendNotification(data: {
        responsavelEmail: string;
        alunoNome: string;
        horarioInicio: string;
        horarioFim: string;
        token: string;
    }): Promise<void>;
}