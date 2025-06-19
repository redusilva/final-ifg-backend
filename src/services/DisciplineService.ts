import { IDiscipline, IDisciplineCreate } from "../intefaces/entities/Discipline";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";

interface DataProps {
    disciplineRepository: IDisciplineRepository;
}

class DisciplineService implements IDisciplineService {
    private disciplineRepository: IDisciplineRepository;

    constructor(data: DataProps) {
        this.disciplineRepository = data.disciplineRepository;
    }

    async create(data: IDisciplineCreate): Promise<IDiscipline> {
        const discipline = await this.disciplineRepository.create(data);
        return discipline;
    }
}

export { DisciplineService };