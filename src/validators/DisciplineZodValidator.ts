import { IntDisciplineValidator } from "../intefaces/validators/IntDisciplineValidator";
import z from "zod";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";

export class DisciplineZodValidator implements IntDisciplineValidator {
    validateCreateDiscipline(data: any): IntValidatorsResponse {
        const DisciplineSchema = z.object({
            name: z.string({
                required_error: 'Name is required',
                invalid_type_error: 'Name must be a string'
            }).min(1, 'Name cannot be empty'),
            description: z.string({
                required_error: 'Description is required',
                invalid_type_error: 'Description must be a string'
            }).min(1, 'Description cannot be empty'),
        });

        const result = DisciplineSchema.safeParse(data);
        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: null
            }
        }

        const formattedData = {
            ...result.data,
            teacher_id: null,
            students: [],
            schedule: []
        }

        return {
            success: true,
            error: null,
            data: formattedData
        }
    }
}