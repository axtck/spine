import { IRoleModel } from "./../../models/RoleModel";
import { IUserModel } from "./../../models/UserModel";
import { InitialDatabaseConstants } from "./../../lib/InitialDatabaseConstants";
import { AuthService } from "./../AuthService";
import sinon, { SinonStubbedInstance } from "sinon";
import { AuthRepository } from "../../repositories/AuthRepository";

describe("Test AuthService", () => {
    const users: IUserModel[] = [...InitialDatabaseConstants.baseUsers];
    const roles: IRoleModel[] = [...InitialDatabaseConstants.userRoles];

    const user: IUserModel = users[0];
    const admin: IUserModel = users[1];
    const moderator: IUserModel = users[2];

    const userRole: IRoleModel = roles[0];
    const adminRole: IRoleModel = roles[1];
    const moderatorRole: IRoleModel = roles[2];

    const authRepositoryStub: SinonStubbedInstance<AuthRepository> = sinon.createStubInstance(AuthRepository);

    function reset() {
        // auth repository

        // get created user id
        authRepositoryStub.getCreatedUserId.reset();
        authRepositoryStub.getCreatedUserId.withArgs(user.username).resolves({ id: user.id });
        authRepositoryStub.getCreatedUserId.withArgs(admin.username).resolves({ id: admin.id });
        authRepositoryStub.getCreatedUserId.withArgs(moderator.username).resolves({ id: moderator.id });

        // get role
        authRepositoryStub.getRole.reset();
        authRepositoryStub.getRole.withArgs(userRole.name).resolves({ id: userRole.id });
        authRepositoryStub.getRole.withArgs(adminRole.name).resolves({ id: adminRole.id });
        authRepositoryStub.getRole.withArgs(moderatorRole.name).resolves({ id: moderatorRole.id });

        // get user
        authRepositoryStub.getUser.reset();
        authRepositoryStub.getUser.withArgs(user.username).resolves(user);
        authRepositoryStub.getUser.withArgs(admin.username).resolves(admin);
        authRepositoryStub.getUser.withArgs(moderator.username).resolves(moderator);

        // get user roles
        authRepositoryStub.getUserRoles.reset();
        authRepositoryStub.getUserRoles.withArgs(user.id).resolves([{ name: userRole.name }]);
        authRepositoryStub.getUserRoles.withArgs(admin.id).resolves([{ name: adminRole.name }]);
        authRepositoryStub.getUserRoles.withArgs(moderator.id).resolves([{ name: moderatorRole.name }]);
    }

    beforeAll(() => {
        reset();
    });

    describe("Test assignRoles", () => {
        const authService: AuthService = new AuthService(authRepositoryStub);
        test("Should assign user role (user role specified)", async () => {
            await authService.assignRoles(user.username, [userRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, 1, 1);
        });

        test("Should assign user role (no role in args)", async () => {
            await authService.assignRoles(moderator.username, null);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, 3, 1);
        });
    });
});