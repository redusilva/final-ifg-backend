import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntClassroomValidator {
    validateCreateClassroom(data: any): IntValidatorsResponse;
}