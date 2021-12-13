import { InfoError } from "./../../lib/errors/InfoError";
import { AuthService } from "./../AuthService";
import sinon from "sinon";
import { authRepositoryStub } from "../../lib/testing/stubs";
import { IUserModel } from "../../models/UserModel";
import { baseUsers, userRoles } from "../../lib/testing/dummies";
import { IRoleModel } from "../../models/RoleModel";

describe("AuthService", () => {
    const user: IUserModel = baseUsers[0];
    const admin: IUserModel = baseUsers[1];
    const moderator: IUserModel = baseUsers[2];

    const userRole: IRoleModel = userRoles[0];
    const adminRole: IRoleModel = userRoles[1];
    const moderatorRole: IRoleModel = userRoles[2];


    describe("assignRoles", () => {
        const authService: AuthService = new AuthService(authRepositoryStub);

        it("should assign user role (user role specified)", async () => {
            await authService.assignRoles(user.username, [userRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, user.id, userRole.id);
        });

        it("should assign user role (no role in args)", async () => {
            await authService.assignRoles(user.username, null);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, user.id, userRole.id);
        });

        it("should assign admin role (admin role specified)", async () => {
            await authService.assignRoles(admin.username, [adminRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, admin.id, adminRole.id);
        });

        it("should assign moderator role (moderator role specified)", async () => {
            await authService.assignRoles(moderator.username, [moderatorRole.name]);
            sinon.assert.calledWithExactly(authRepositoryStub.createUserRole, moderator.id, moderatorRole.id);
        });

        it("should not assign role (no created user found)", async () => {
            authRepositoryStub.getCreatedUserId.withArgs("").resolves(null);
            await expect(authService.assignRoles("", [moderatorRole.name]))
                .rejects.toThrow(InfoError);
        });

        it("should not assign role (no role found)", async () => {
            authRepositoryStub.getRole.withArgs("").resolves(null);
            await expect(authService.assignRoles("admin", ["", ""]))
                .rejects.toThrow(InfoError);
        });
    });
});