import { IDiscipline, IDisciplineCreate } from "../intefaces/entities/Discipline";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { DisciplineModel } from "../models/DisciplineMongooseModel";
import { buildDiscipline } from "../utils/builder";

class DisciplineMongooseRepository implements IDisciplineRepository {
    async create(data: IDisciplineCreate): Promise<IDiscipline> {
        const discipline = new DisciplineModel(data);
        await discipline.save();

        return buildDiscipline(discipline);
    }
}

export { DisciplineMongooseRepository };