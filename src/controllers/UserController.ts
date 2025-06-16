import { IntUserService } from "../intefaces/services/IntUserService";
import { Request, Response } from "express";

interface UserControllerProps {
    userService: IntUserService;
}

class UserController {
    private userService: IntUserService;
    constructor({ userService }: UserControllerProps) {
        this.userService = userService;
    }

    async create(req: Request, res: Response) {
        return res.json({
            message: "User created",
        })
    }
}

export default UserController;