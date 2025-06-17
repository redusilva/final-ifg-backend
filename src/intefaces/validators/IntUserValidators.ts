import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntUserValidator {
    validateCreateUser: (data: any) => IntValidatorsResponse;
}