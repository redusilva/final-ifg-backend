import axios from "axios";
import { config } from "../confg/env";

export const validateToken = async (token: string): Promise<boolean> => {
    try {
        const url = `${config.AUTH_SERVICE_URL}/auth/token`;
        const response = await axios.post(url, { token });
        return response.status === 200;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}