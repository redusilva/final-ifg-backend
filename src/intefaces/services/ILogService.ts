export interface ILogService {
    createLog(message: string, level: 'info' | 'warn' | 'error'): Promise<void>;
}