import z from "zod";
import { IntAttendanceValidator } from "../intefaces/validators/IntAttendanceValidator";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";
import { mongoIdRegex } from "../utils/enum";

class AttendanceZodValidator implements IntAttendanceValidator {
    validateCheckPresence(data: any): IntValidatorsResponse {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const checkPresenceSchema = z.object({
            student_id: z.string().regex(mongoIdRegex),
            discipline_id: z.string().regex(mongoIdRegex),
            is_present: z.boolean(),
            start_time: z.string().regex(timeRegex, 'start_time must be in HH:mm format'),
            class_date: z.string().transform((dateStr, ctx) => {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.invalid_date,
                        message: "Invalid date format for class_date",
                    });
                    return z.NEVER;
                }
                date.setUTCHours(0, 0, 0, 0);
                return date;
            })
        }).transform((data) => ({
            studentId: data.student_id,
            disciplineId: data.discipline_id,
            isPresent: data.is_present,
            startTime: data.start_time,
            classDate: data.class_date
        }));

        const result = checkPresenceSchema.safeParse(data);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: null
            };
        }

        return {
            success: true,
            error: null,
            data: result.data
        };
    }

    validateCheckTeacherPresence(data: any): IntValidatorsResponse {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        const checkPresenceSchema = z.object({
            teacher_id: z.string().regex(mongoIdRegex),
            discipline_id: z.string().regex(mongoIdRegex),
            is_present: z.boolean(),
            start_time: z.string().regex(timeRegex, 'start_time must be in HH:mm format'),
            class_date: z.string().transform((dateStr, ctx) => {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.invalid_date,
                        message: "Invalid date format for class_date",
                    });
                    return z.NEVER;
                }
                date.setUTCHours(0, 0, 0, 0);
                return date;
            })
        }).transform((data) => ({
            teacherId: data.teacher_id,
            disciplineId: data.discipline_id,
            isPresent: data.is_present,
            startTime: data.start_time,
            classDate: data.class_date
        }));

        const result = checkPresenceSchema.safeParse(data);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: null
            };
        }

        return {
            success: true,
            error: null,
            data: result.data
        };
    }
}

export default AttendanceZodValidator;