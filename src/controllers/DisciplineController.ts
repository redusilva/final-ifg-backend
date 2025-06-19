import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { ILogService } from "../intefaces/services/ILogService";
import { IntNotificationService } from "../intefaces/services/IntNotificationService";
import { IntUserService } from "../intefaces/services/IntUserService";
import { IntDisciplineValidator } from "../intefaces/validators/IntDisciplineValidator";

interface DataProps {
    disciplineService: IDisciplineService;
    logService: ILogService;
    notificationService: IntNotificationService;
    validator: IntDisciplineValidator;
    userService: IntUserService;
    databaseService: IDatabaseService;
}

class DisciplineController {
    private disciplineService: IDisciplineService;
    private logService: ILogService;
    private notificationService: IntNotificationService;
    private validator: IntDisciplineValidator;
    private userService: IntUserService;
    private databaseService: IDatabaseService;

    constructor(data: DataProps) {
        this.disciplineService = data.disciplineService;
        this.logService = data.logService;
        this.notificationService = data.notificationService;
        this.validator = data.validator;
        this.userService = data.userService;
        this.databaseService = data.databaseService;
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

    async registerStudents(req: any, res: any) {
        const session = await this.databaseService.startTransaction();
        try {
            const { success, error, data } = this.validator.validateRegisterStudents(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                studentId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, session);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.subscribeStudentToDiscipline(disciplineId, user, session);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            await this.databaseService.commitTransaction(session);

            this.notificationService.sendNotification(`O aluno ${user.name} foi inscrito na disciplina ${result.data.name}`);

            return res.status(200).json(result.data);
        } catch (error: any) {
            await this.databaseService.rollbackTransaction(session);
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async removeStudent(req: any, res: any) {
        const session = await this.databaseService.startTransaction();
        try {
            const { success, error, data } = this.validator.validateRegisterStudents(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                studentId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, session);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.unsubscribeStudentFromDiscipline(disciplineId, user, session);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            await this.databaseService.commitTransaction(session);

            this.notificationService.sendNotification(`O aluno ${user.name} foi removido da disciplina ${result.data.name}`);

            return res.status(200).json(result.data);
        } catch (error: any) {
            await this.databaseService.rollbackTransaction(session);
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
}

export default DisciplineController;