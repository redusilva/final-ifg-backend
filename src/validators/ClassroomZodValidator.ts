import { IntClassroomValidator } from "../intefaces/validators/IntClassroomValidator";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";
import z from "zod";

class ClassroomZodValidator implements IntClassroomValidator {
    validateCreateClassroom(data: any): IntValidatorsResponse {
        const classroomSchema = z.object({
            name: z.string().min(1),
            latitude: z.string().min(1),
            longitude: z.string().min(1),
            min_distance: z.number().nonnegative('Min distance must be zero or positive'),
        });

        const result = classroomSchema.safeParse(data);
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

export default ClassroomZodValidator;