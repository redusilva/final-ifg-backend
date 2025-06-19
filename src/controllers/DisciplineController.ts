import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { ILogService } from "../intefaces/services/ILogService";
import { IntNotificationService } from "../intefaces/services/IntNotificationService";
import { IntDisciplineValidator } from "../intefaces/validators/IntDisciplineValidator";

interface DataProps {
    disciplineService: IDisciplineService;
    logService: ILogService;
    notificationService: IntNotificationService;
    validator: IntDisciplineValidator;
}

class DisciplineController {
    private disciplineService: IDisciplineService;
    private logService: ILogService;
    private notificationService: IntNotificationService;
    private validator: IntDisciplineValidator;

    constructor(data: DataProps) {
        this.disciplineService = data.disciplineService;
        this.logService = data.logService;
        this.notificationService = data.notificationService;
        this.validator = data.validator;
    }

    async create(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateCreateDiscipline(req.body);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const discipline = await this.disciplineService.create(data);
            return res.status(201).json(discipline);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
}

export default DisciplineController;