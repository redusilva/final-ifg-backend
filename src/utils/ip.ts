import axios from "axios";
import { config } from "../confg/env";

export const validateIP = async (ipAddress: string): Promise<any> => {
    try {
        const url = `${config.IP_CHECKER_URL}/check-ip`;
        const response = await axios.post(url, {
            ip_address: ipAddress
        });
        const data = await response.data;
        console.log('validateIP data:', data);
        // if (data.reason === 'Erro na API do AbuseIPDB: 401') {
        //     return true;
        // }

        return data.is_valid;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}

export const validateTunnel = async (ipAddress: string): Promise<any> => {
    try {
        const url = `${config.TUNNEL_CHECKER_URL}/check-vpn`;
        const response = await axios.post(url, {
            ip_address: ipAddress
        });

        // se for suspeito, retorna false pois não é válido
        return response.data.suspicious ? false : true;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}