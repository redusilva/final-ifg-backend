import { ILocationController } from "../intefaces/controllers/ILocationController";
import { ILocationService } from "../intefaces/services/ILocationService";
import { ILogService } from "../intefaces/services/ILogService";
import { Request, Response } from "express";
import { IntLocationValidator } from "../intefaces/validators/IntLocationValidator";

interface Props {
    locationService: ILocationService;
    logService: ILogService;
    locationValidator: IntLocationValidator;
}

class LocationExpressController implements ILocationController {
    private locationService: ILocationService;
    private logService: ILogService;
    private locationValidator: IntLocationValidator;

    constructor(data: Props) {
        this.locationService = data.locationService;
        this.logService = data.logService;
        this.locationValidator = data.locationValidator;
    }

    async createLocation(req: Request, res: Response) {
        try {
            const { success, error, data } = this.locationValidator.validateCreateLocation(req.body);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const result = await this.locationService.create(data, null);
            if (result.status === 201) {
                return res.status(201).json(result.data);
            }

            return res.status(result.status as number).json({
                errors: { error: result.error }
            });

        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    }

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const result = await this.locationService.getAll(null);
            return res.status(200).json(result);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
}

export default LocationExpressController;