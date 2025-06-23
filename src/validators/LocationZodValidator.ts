import { IntLocationValidator } from "../intefaces/validators/IntLocationValidator";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";
import z from "zod";

class LocationZodValidator implements IntLocationValidator {
    validateCreateLocation(data: any): IntValidatorsResponse {
        const locationSchema = z.object({
            name: z.string().min(1),
            latitude: z.string().min(1),
            longitude: z.string().min(1),
            min_distance: z.number().nonnegative('Min distance must be zero or positive'),
        });

        const result = locationSchema.safeParse(data);
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

export default LocationZodValidator;