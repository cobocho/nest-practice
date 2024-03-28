import { UsersModel } from './entity/users.entity';
import { Repository } from 'typeorm';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<UsersModel>);
    createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>): Promise<UsersModel>;
    getAllUsers(): Promise<UsersModel[]>;
    getUserByEmail(email: string): Promise<UsersModel>;
}
