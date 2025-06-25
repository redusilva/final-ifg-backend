import { ILocationController } from "../intefaces/controllers/ILocationController";
import { ILocationService } from "../intefaces/services/ILocationService";
import { ILogService } from "../intefaces/services/ILogService";
import { Request, Response } from "express";
import { IntLocationValidator } from "../intefaces/validators/IntLocationValidator";
import mongoose from "mongoose";

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

    async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await this.locationService.findById(id, null);
            if (!result) {
                return res.status(404).json({
                    error: 'Location not found'
                });
            }

            return res.status(200).json(result);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async deleteById(req: Request, res: Response): Promise<any> {
        const session = await mongoose.startSession();

        try {
            const { id } = req.params;

            session.startTransaction();

            const result = await this.locationService.deleteById(id, session);

            if (result.status !== 200) {
                await session.abortTransaction();
                return res.status(result.status as number).json({
                    error: result.error
                });
            }

            await session.commitTransaction();

            return res.status(200).json({
                message: 'Location deleted'
            });
        } catch (error: any) {
            await session.abortTransaction();
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        } finally {
            session.endSession();
        }
    }
}

export default LocationExpressController;