import { IntUserValidator } from "../intefaces/validators/IntUserValidators";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";
import z from "zod";

class UserZodValidator implements IntUserValidator {
    validateCreateUser(data: any): IntValidatorsResponse {
        const userSchema = z.object({
            email: z.string().email(),
            name: z.string().trim().min(2),
            type: z.enum(['student', 'teacher']),
            phone: z.string()
                .transform(val => val.replace(/\D/g, ''))
                .refine(val => val.length >= 8, {
                    message: 'Phone must have at least 8 digits considering only numeric values'
                })
        });

        const result = userSchema.safeParse(data);
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: null
            }
        }

        return {
            success: true,
            error: null,
            data: result.data
        }
    };
}

export default UserZodValidator;