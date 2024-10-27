import { REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { APIException } from "./components/http";
import { AuthUtil } from "../utils/auth";
import { UUID } from "../utils/uuid";
import { Mail } from "./components/mail";
import { User } from "./components/user";

export interface SignUpRequest {
    email: string;
    alias: string;
    password: string;
    displayName: string | undefined;
}

export enum SignUpException {
    ALREADY_EXISTS_EMAIL = "already_exists_email",
    ALREADY_EXISTS_ALIAS = "already_exists_alias"
}

export const SIGN_UP_HTTP_HANDLER = new HTTPHandler(async (request, response, requestBody) => {
    // Ignore the request because the request for get method cannot define the body.
    if (request.method == "GET") {
        response.writeHead(400);
        response.end();
        return;
    }

    try {
        const data = JSON.parse(requestBody) as SignUpRequest;

        if (data.email && data.password && data.alias) {
            if (await User.existsEmail(data.email)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_EMAIL);
                return;
            }

            if (await User.existsAlias(data.alias)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const authUUID = UUID.v4();
            const authNums = AuthUtil.createNumbers(6);

            Mail.sendHTML(data.email, "Your authentication number for sign-up about Quark Icons", authNums);

            REDIS_CLIENT.hSet("Auth", authUUID, JSON.stringify({...data, ...{
                numbers: authNums,
            }}));

            // Sets the expire duration to 10 minute for the auth-numbers.
            REDIS_CLIENT.hExpire("Auth", authUUID, 600);

            response.writeHead(200);
            response.end(authUUID);
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    } catch (_) {
        response.writeHead(400);
        response.end(APIException.INVALID_REQUEST_FORMAT);
    }
});