import { Database } from "./../../core/Database";
import { Logger } from "./../../core/Logger";
import { UserRepository } from "./UserRepository";
import { Service } from "../../core/Service";
import { injectable } from "tsyringe";

@injectable()
export class UserService extends Service {
    private readonly userRepository: UserRepository;

    constructor(logger: Logger, database: Database, userRepository: UserRepository) {
        super(logger, database);
        this.userRepository = userRepository;
    }
}