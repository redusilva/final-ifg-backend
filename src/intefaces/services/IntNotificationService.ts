export interface IntNotificationService {
    sendNotification(message: string): Promise<void>;
}