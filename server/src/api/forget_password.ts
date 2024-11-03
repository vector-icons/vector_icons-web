import { PG_CLIENT, REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";
import { HTTPUtil } from "../utils/http";
import { UUID } from "../utils/uuid";
import { APIException } from "./components/http";
import { Mail } from "./components/mail";

interface ForgetPasswordRequest {
    email: string;
    alias: string;
    password: string;
}

enum ForgetPasswordException {
    INVALID_EMAIL = "invalid_email",
    INVALID_ALIAS = "invalid_alias"
}

export const FORGET_PASSWORD_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, requestBody) => {
        const given = HTTPUtil.parseRequest<ForgetPasswordRequest>(requestBody, response);
        if (!given) return;

        if (given.password && given.alias || given.email) {
            const result = given.email
                ? await PG_CLIENT.query(`SELECT "id" FROM "User" WHERE "email" = $1 LIMIT 1`, [given.email])
                : await PG_CLIENT.query(`SELECT "id" FROM "User" WHERE "alias" = $1 LIMIT 1`, [given.alias]);

            if (result.rowCount == null || result.rowCount == 0) {
                response.writeHead(400);
                response.end(given.email ? ForgetPasswordException.INVALID_EMAIL : ForgetPasswordException.INVALID_ALIAS);
                return;
            }

            const userId = result.rows[0]["id"];
            const authUUID = UUID.v4();
            const authNums = AuthUtil.createNumbers(6);

            await Mail.sendHTML(given.email, "Your authentication numbers for forget password about Quark Icons", authNums);

            // Sets the auth-number for the next forget password task.
            REDIS_CLIENT.hSet("ForgetPasswordAuth", authUUID, JSON.stringify({
                userId: userId,
                numbers: authNums,
                password: given.password
            }));

            // Sets the expire duration to 10 minute for the auth-numbers.
            REDIS_CLIENT.hExpire("ForgetPasswordAuth", authUUID, AuthUtil.DURATION);

            response.writeHead(200);
            response.end(authUUID);
        } else {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
        }
    }
});