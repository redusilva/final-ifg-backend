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
            total_classes: z.number({
                required_error: 'Total classes is required',
                invalid_type_error: 'Total classes must be a number'
            }).int().positive('Total classes must be a positive integer'),
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
            classroom_id: null,
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

    validateRegisterTeacher(data: any): IntValidatorsResponse {
        const RegisterTeacherSchema = z.object({
            teacherId: z.string({
                required_error: 'Teacher ID is required',
                invalid_type_error: 'Teacher ID must be a string'
            })
                .min(1, 'Teacher ID cannot be empty')
                .regex(mongoIdRegex, 'Teacher ID must be a valid MongoDB ObjectId'),

            disciplineId: z.string({
                required_error: 'Discipline ID is required',
                invalid_type_error: 'Discipline ID must be a string'
            })
                .min(1, 'Discipline ID cannot be empty')
                .regex(mongoIdRegex, 'Discipline ID must be a valid MongoDB ObjectId')
        });

        const result = RegisterTeacherSchema.safeParse(data);
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

    validateRegisterSchedule(data: any): IntValidatorsResponse {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const RegisterScheduleSchema = z.object({
            day_of_week: z.number().min(0).max(6),
            start_time: z.string().regex(timeRegex, { message: 'start_time must be in HH:mm format' }),
            end_time: z.string().regex(timeRegex, { message: 'end_time must be in HH:mm format' })
        });

        const result = RegisterScheduleSchema.safeParse(data);
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

    validateDeleteSchedule(data: any): IntValidatorsResponse {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const DeleteScheduleSchema = z.object({
            day_of_week: z.number().min(0).max(6),
            start_time: z.string().regex(timeRegex, { message: 'start_time must be in HH:mm format' }),
        });

        const result = DeleteScheduleSchema.safeParse(data);
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