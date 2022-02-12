import { UserRepository } from "./UserRepository";
import { Service } from "../../core/Service";
import { Pool } from "mysql2/promise";

export class UserService extends Service {
    constructor(pool: Pool,
        private readonly userRepository: UserRepository = new UserRepository(pool)) {
        super(pool);
    }
}