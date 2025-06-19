import { IDiscipline, IDisciplineCreate } from "../entities/Discipline";

export interface IDisciplineService {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
}