import { UserRepository } from "./UserRepository";
import { Service } from "../../core/Service";

export class UserService extends Service {

    private userRepository = new UserRepository();

}