import { SessionType } from "../intefaces/config/IntDatabase";
import { IntBasicUser, IUser, UserType } from "../intefaces/entities/User";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IntUserRepository } from "../intefaces/repositories/IntUserRepository";
import { IntUserService } from "../intefaces/services/IntUserService";

interface UserServiceProps {
    userRepository: IntUserRepository;
    disciplineRepository: IDisciplineRepository;
}

class UserService implements IntUserService {
    private userRepository: IntUserRepository;
    private disciplineRepository: IDisciplineRepository;

    constructor(data: UserServiceProps) {
        this.userRepository = data.userRepository;
        this.disciplineRepository = data.disciplineRepository;
    }

    async findUserByEmail(email: string, session: SessionType): Promise<IUser | null> {
        const currentUser = await this.userRepository.findUserByEmail(email, session);
        return currentUser;
    }

    async createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null> {
        const newUser = await this.userRepository.createUser(user, session);
        return newUser;
    }

    async findUserById(id: string, session: SessionType): Promise<IUser | null> {
        const currentUser = await this.userRepository.findUserById(id, session);
        return currentUser;
    }

    async deleteUserById(id: string, session: SessionType): Promise<void> {
        await Promise.all([
            this.userRepository.deleteUserById(id, session),
            this.disciplineRepository.removeUserFromAllDisciplines(id, session)
        ])
    }

    async findAllUsers(session: SessionType): Promise<IUser[]> {
        const users = await this.userRepository.findAllUsers(session);
        return users;
    }

    async findAllUsersByType(type: UserType, session: SessionType): Promise<IUser[]> {
        const users = await this.userRepository.findAllUsersByType(type, session);
        return users;
    }
}

export default UserService;
