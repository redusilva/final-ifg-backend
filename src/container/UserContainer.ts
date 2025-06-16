import UserController from "../controllers/UserController";
import UserMongooseRepository from "../repositories/UserMongooseRepository";
import UserService from "../services/UserService";

const userMongooseRepository = new UserMongooseRepository();
const userService = new UserService({
    userRepository: userMongooseRepository
});
const userController = new UserController({
    userService
});

export { userController };