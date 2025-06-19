import { IDisciplineCreate, IDiscipline } from "../entities/Discipline";

export interface IDisciplineRepository {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
}