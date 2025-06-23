import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntLocationValidator {
    validateCreateLocation(data: any): IntValidatorsResponse;
}