export interface ILocationController {
    createLocation(req: any, res: any): Promise<any>;
    getAll(req: any, res: any): Promise<any>;
}