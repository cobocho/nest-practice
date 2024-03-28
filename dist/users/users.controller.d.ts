import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(): Promise<import("src/users/entity/users.entity").UsersModel[]>;
}
