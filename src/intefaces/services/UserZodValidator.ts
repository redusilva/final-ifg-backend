import { CreateUserValidator, LoginUserValidator, ValidateTokenSchema } from "../../validators/UserValidator";
import { IUserValidator } from "./IUserValidator";

export class UserZodValidator implements IUserValidator {
    validateCreateUser(data: any): { success: boolean; error: any; data: any; } {
        const result = CreateUserValidator.safeParse(data);
        return {
            success: result.success,
            error: result.error,
            data: result.data
        };
    }
    validateLoginUser(data: any): { success: boolean; error: any; data: any; } {
        const result = LoginUserValidator.safeParse(data);
        return {
            success: result.success,
            error: result.error,
            data: result.data
        };
    }
    validateToken(data: any): { success: boolean; error: any; data: any; } {
        const result = ValidateTokenSchema.safeParse(data);
        return {
            success: result.success,
            error: result.error,
            data: result.data
        };
    }
}