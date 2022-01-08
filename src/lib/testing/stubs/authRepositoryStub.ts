import sinon, { SinonStubbedInstance } from "sinon";
import { AuthRepository } from "../../../services/authentication/AuthRepository";
import {
    dummyAdmin, dummyAdminRole, dummyModerator,
    dummyModeratorRole, dummyUser, dummyUserRole
} from "../data/dummies";


// auth repository
const authRepositoryStub: SinonStubbedInstance<AuthRepository> = sinon.createStubInstance(AuthRepository);

// get created user id
authRepositoryStub.getCreatedUserId.withArgs(dummyUser.username).resolves({ id: dummyUser.id });
authRepositoryStub.getCreatedUserId.withArgs(dummyAdmin.username).resolves({ id: dummyAdmin.id });
authRepositoryStub.getCreatedUserId.withArgs(dummyModerator.username).resolves({ id: dummyModerator.id });
authRepositoryStub.getCreatedUserId.withArgs("").resolves(null); // test exception handling 

// get role
authRepositoryStub.getRole.withArgs(dummyUserRole.name).resolves({ id: dummyUserRole.id });
authRepositoryStub.getRole.withArgs(dummyAdminRole.name).resolves({ id: dummyAdminRole.id });
authRepositoryStub.getRole.withArgs(dummyModeratorRole.name).resolves({ id: dummyModeratorRole.id });
authRepositoryStub.getRole.withArgs("").resolves(null);

// get user
authRepositoryStub.getUser.withArgs(dummyUser.username).resolves(dummyUser);
authRepositoryStub.getUser.withArgs(dummyAdmin.username).resolves(dummyAdmin);
authRepositoryStub.getUser.withArgs(dummyModerator.username).resolves(dummyModerator);
authRepositoryStub.getUser.withArgs("").resolves(null);

// get user roles
authRepositoryStub.getUserRoleNames.withArgs(dummyUser.id).resolves([{ name: dummyUserRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(dummyAdmin.id).resolves([{ name: dummyAdminRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(dummyModerator.id).resolves([{ name: dummyModeratorRole.name }]);
authRepositoryStub.getUserRoleNames.withArgs(0).resolves(null);

export {
    authRepositoryStub
};