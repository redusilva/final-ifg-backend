export interface IUserValidator {
    validateCreateUser(data: any): { success: boolean; error: any; data: any };

    validateLoginUser(data: any): { success: boolean; error: any; data: any };

    validateToken(data: any): { success: boolean; error: any; data: any };
}