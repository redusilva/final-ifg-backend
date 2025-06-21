import { IntValidatorsResponse } from "./IntValidatorsResponse";

export interface IntDisciplineValidator {
    validateCreateDiscipline: (data: any) => IntValidatorsResponse;
    validateRegisterStudents: (data: any) => IntValidatorsResponse;
    validateRegisterTeacher: (data: any) => IntValidatorsResponse;
    validateRegisterSchedule(data: any): IntValidatorsResponse;
}