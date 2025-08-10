import { z } from "zod";
import { IntValidatorsResponse } from "../intefaces/validators/IntValidatorsResponse";

export class DisciplineGetByDayZodValidator {
    static validate(data: any): IntValidatorsResponse {
        const schema = z.object({
            day: z.string().transform(Number).refine(day => day >= 0 && day <= 6, {
                message: "Day must be a number between 0 and 6",
            }),
        });

        const result = schema.safeParse(data);

        if (!result.success) {
            return {
                success: false,
                error: result.error,
                data: null,
            };
        }

        return {
            success: true,
            error: null,
            data: result.data,
        };
    }
}