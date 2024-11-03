import { REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { APIException } from "./components/http";
import { AuthUtil } from "../utils/auth";
import { UUID } from "../utils/uuid";
import { Mail } from "./components/mail";
import { User } from "./components/user";
import { HTTPUtil } from "../utils/http";

export interface SignUpRequest {
    email: string;
    alias: string;
    password: string;
    displayName: string | undefined;
}

export enum SignUpException {
    ALREADY_EXISTS_EMAIL = "already_exists_email",
    ALREADY_EXISTS_ALIAS = "already_exists_alias",
    INVALID_EMAIL_FORMAT = "invalid_email_format"
}

export const SIGN_UP_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, requestBody) => {
        const given = HTTPUtil.parseRequest<SignUpRequest>(requestBody, response);
        if (!given) return;

        if (given.email && given.password && given.alias) {
            if (await User.existsEmail(given.email)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_EMAIL);
                return;
            }

            if (await User.existsAlias(given.alias)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const authUUID = UUID.v4();
            const authNums = AuthUtil.createNumbers(6);

            try {
                await Mail.sendHTML(given.email, "Your authentication numbers for sign-up about Quark Icons", authNums);

                // Sets the auth-number for the next sign-up task.
                REDIS_CLIENT.hSet("SignUpAuth", authUUID, JSON.stringify({...given, ...{numbers: authNums}}));

                // Sets the expire duration to 10 minute for the auth-numbers.
                REDIS_CLIENT.hExpire("SignUpAuth", authUUID, AuthUtil.DURATION);

                response.writeHead(200);
                response.end(authUUID);
            } catch {
                response.writeHead(400);
                response.end(SignUpException.INVALID_EMAIL_FORMAT);
            }
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});