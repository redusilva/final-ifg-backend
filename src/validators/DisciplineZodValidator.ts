import { IntDisciplineValidator } from "../intefaces/validators/IntDisciplineValidator";
import z from "zod";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";
import { mongoIdRegex } from "../utils/enum";

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

    validateRegisterStudents(data: any): IntValidatorsResponse {
        const RegisterStudentsSchema = z.object({
            studentId: z.string({
                required_error: 'Student ID is required',
                invalid_type_error: 'Student ID must be a string'
            })
                .min(1, 'Student ID cannot be empty')
                .regex(mongoIdRegex, 'Student ID must be a valid MongoDB ObjectId'),

            disciplineId: z.string({
                required_error: 'Discipline ID is required',
                invalid_type_error: 'Discipline ID must be a string'
            })
                .min(1, 'Discipline ID cannot be empty')
                .regex(mongoIdRegex, 'Discipline ID must be a valid MongoDB ObjectId')
        });

        const result = RegisterStudentsSchema.safeParse(data);
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
    }
}