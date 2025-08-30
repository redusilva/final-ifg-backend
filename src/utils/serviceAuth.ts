import axios from "axios";
import { config } from "config/env";

const login = async () => {
    try {
        const url = `${config.AUTH_SERVICE_URL}/auth/login`;
        const response = await axios.post(url, {
            email: config.MAIN_BACKEND_USER,
            password: config.MAIN_BACKEND_PASSWORD
        });
        return {
            status: response.status,
            data: response.data.token
        };
    } catch (error: any) {
        console.error('Error validating token:', error);
        return {
            status: error.response.status,
            data: null
        }
    }
}

const createUser = async () => {
    try {
        const url = `${config.AUTH_SERVICE_URL}/auth`;
        const response = await axios.post(url, {
            name: config.MAIN_BACKEND_USER,
            email: config.MAIN_BACKEND_USER,
            password: config.MAIN_BACKEND_PASSWORD,
            type: "student",
            phone: "62999999999"
        });
        return {
            status: response.status,
            data: response.data.token
        };
    } catch (error: any) {
        console.error('Error validating token:', error);
        return {
            status: error.response.status,
            data: null
        }
    }
}

export const getServiceToken = async () => {
    try {
        const firstResult = await login();
        if (firstResult.status === 200) {
            console.log('Token already exists');
            return firstResult.data;
        }

        const newUser = await createUser();
        console.log('making new user');
        if (newUser.status !== 201) {
            throw new Error('Error creating user');
        }

        const newToken = await login();
        console.log('making new token');
        if (newToken.status !== 200) {
            throw new Error('Error getting token');
        }

        return newToken.data;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}