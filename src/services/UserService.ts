import { IntUserRepository } from "../intefaces/repositories/IntUserRepository";
import { IntUserService } from "../intefaces/services/IntUserService";

interface UserServiceProps {
    userRepository: IntUserRepository;
}

class UserService implements IntUserService {
    private userRepository: IntUserRepository;

    constructor({ userRepository }: UserServiceProps) {
        this.userRepository = userRepository;
    }
}

export default UserService;
