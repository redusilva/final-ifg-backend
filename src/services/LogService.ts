import { ILogService } from "../intefaces/services/ILogService";

export class LogService implements ILogService {
    async createLog(message: string, level: 'info' | 'warn' | 'error'): Promise<void> {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
    }
}