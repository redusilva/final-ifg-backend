import axios from "axios";
import { ILogService } from "../intefaces/services/ILogService";
import { getServiceToken } from "../utils/serviceAuth";
import { config } from "../config/env";

export class LogService implements ILogService {
    async createLog(message: string, level: 'info' | 'warn' | 'error'): Promise<void> {
        try {

            const token = await getServiceToken();
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await axios.post(`${config.LOGS_SERVICE_URL}/api/logs`, {
                message: message,
                level: level,
                service: "aplicacao",
                systemId: config.LOGS_SERVICE_ID
            });

            console.log(`Log criado com sucesso: ${message}`);
        } catch (error: any) {
            console.error('Erro ao cadastrar log:', error.message);
        }
    }
}