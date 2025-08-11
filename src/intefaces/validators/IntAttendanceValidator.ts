import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntAttendanceValidator {
    validateCheckPresence(data: any): IntValidatorsResponse;
}