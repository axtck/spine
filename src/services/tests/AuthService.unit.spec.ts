import sinon from "sinon";
import { AuthRepository } from "../../repositories/AuthRepository";
import { Id } from "../../types";

describe("Test AuthService", () => {

    const authRepository: AuthRepository = new AuthRepository();

    const getCreatedUserIdResponse: { id: Id } = {
        id: 1
    };

    function reset() {
        sinon.stub(authRepository, "getCreatedUserId").returns(Promise.resolve(getCreatedUserIdResponse));
    }

    beforeAll(() => {
        reset();
    });

    describe("Test assignRoles", () => {
        test("Should fail", () => {
            console.log("testing");

        });
    });

})