import { AuthService } from "./../AuthService";
import sinon from "sinon";
import { AuthRepository } from "../../repositories/AuthRepository";
import { Id } from "../../types";

describe("Test AuthService", () => {

    const authRepository: AuthRepository = new AuthRepository();

    const getCreatedUserIdResponse: { id: Id; } = {
        id: 1
    };

    function setup() {
        sinon.stub(authRepository, "getCreatedUserId").returns(Promise.resolve(getCreatedUserIdResponse));
    }

    beforeAll(() => {
        setup();
    });

    describe("Test assignRoles", () => {
        const authService: AuthService = new AuthService(authRepository);
        test("Should fail", () => {
            authService.assignRoles("something", ["something"]);
        });
    });

});