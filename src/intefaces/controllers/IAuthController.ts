export interface IAuthController {
    create(req: any, res: any): Promise<any>;

    login(req: any, res: any): Promise<any>;
}