import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntDisciplineValidator {
    validateCreateDiscipline: (data: any) => IntValidatorsResponse;
}