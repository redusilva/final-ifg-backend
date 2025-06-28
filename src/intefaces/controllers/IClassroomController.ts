export interface IClassroomController {
    createClassroom(req: any, res: any): Promise<any>;
    getAll(req: any, res: any): Promise<any>;
    getById(req: any, res: any): Promise<any>;
    deleteById(req: any, res: any): Promise<any>;
}