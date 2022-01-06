import sinon, { SinonStubbedInstance } from "sinon";
import { AuthRepository } from "../../../repositories/AuthRepository";
import { IUser, IRole } from "../../../types";
import { baseUsers, userRoles } from "../data/dummies";

const user: IUser = baseUsers[0];
const admin: IUser = baseUsers[1];
const moderator: IUser = baseUsers[2];

const userRole: IRole = userRoles[0];
const adminRole: IRole = userRoles[1];
const moderatorRole: IRole = userRoles[2];

// auth repository
const authRepositoryStub: SinonStubbedInstance<AuthRepository> = sinon.createStubInstance(AuthRepository);

// get created user id
authRepositoryStub.getCreatedUserId.withArgs(user.username).resolves({ id: user.id });
authRepositoryStub.getCreatedUserId.withArgs(admin.username).resolves({ id: admin.id });
authRepositoryStub.getCreatedUserId.withArgs(moderator.username).resolves({ id: moderator.id });
authRepositoryStub.getCreatedUserId.withArgs("").resolves(null); // test exception handling 

// get role
authRepositoryStub.getRole.withArgs(userRole.name).resolves({ id: userRole.id });
authRepositoryStub.getRole.withArgs(adminRole.name).resolves({ id: adminRole.id });
authRepositoryStub.getRole.withArgs(moderatorRole.name).resolves({ id: moderatorRole.id });
authRepositoryStub.getRole.withArgs("").resolves(null);

// get user
authRepositoryStub.getUser.withArgs(user.username).resolves(user);
authRepositoryStub.getUser.withArgs(admin.username).resolves(admin);
authRepositoryStub.getUser.withArgs(moderator.username).resolves(moderator);
authRepositoryStub.getUser.withArgs("").resolves(null);

// get user roles
authRepositoryStub.getUserRoleNames.withArgs(user.id).resolves([{ name: userRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(admin.id).resolves([{ name: adminRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(moderator.id).resolves([{ name: moderatorRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(0).resolves(null);

export {
    authRepositoryStub
};