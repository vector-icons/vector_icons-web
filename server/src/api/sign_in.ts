import { createHash, hash } from "crypto";
import { PG_CLIENT, REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { APIException } from "./components/http";
import { AuthUtil } from "../utils/auth";
import { HTTPUtil } from "../utils/http";

interface SignInRequest {
    email: string;
    alias: string;
    password: string;
}

enum SignInException {
    INVALID_EMAIL = "invalid_email",
    INVALID_ALIAS = "invalid_alias",
    INVALID_PASSWORD = "invalid_password"
}

export const SIGN_IN_HTTP_HANDLER = new HTTPHandler(async (request, response, requestBody) => {
    // Ignore the request because the request for get method cannot define the body.
    if (request.method != "POST") {
        response.writeHead(400);
        response.end(APIException.INVALID_REQUEST_METHOD);
        return;
    }

    const given = HTTPUtil.parseRequest<SignInRequest>(requestBody, response);
    if (given == null) {
        return;
    }

    let userId: string;
    let password: string;
    let passwordSalt: string;

    // Is missing required the properties a given request data.
    if (given.email == null && given.alias == null && given.password == null) {
        response.writeHead(400);
        response.end(APIException.MISSING_REQUEST_FORMAT);
        return;
    }

    const result = given.email
        ? await PG_CLIENT.query(`SELECT "id", "password", "passwordSalt" FROM "User" WHERE "email" = $1`, [given.email])
        : await PG_CLIENT.query(`SELECT "id", "password", "passwordSalt" FROM "User" WHERE "alias" = $1`, [given.alias]);

    if (result.rowCount == null || result.rowCount == 0) {
        response.writeHead(400);
        response.end(given.email ? SignInException.INVALID_EMAIL : SignInException.INVALID_ALIAS);
        return;
    }

    userId = result.rows[0]["id"];
    password = result.rows[0]["password"];
    passwordSalt = result.rows[0]["passwordSalt"];

    let givenPassword = createHash("sha512").update(given.password + passwordSalt).digest("base64");
    if (givenPassword === password) {
        const accessToken = AuthUtil.createToken();
        const refreshToken = AuthUtil.createToken();

        await REDIS_CLIENT.multi()
            .hSet("AccessToken", accessToken, userId)
            .hSet("RefreshToken", refreshToken, userId)
            .hExpire("AccessToken", accessToken, AuthUtil.ACCESS_TOKEN_EXPIER_DURATION)
            .hExpire("RefreshToken", refreshToken, AuthUtil.REFRESH_TOKEN_EXPIER_DURATION)
            .exec();

        // Sets the access token as the http-only cookie.
        AuthUtil.setAccessTokenAsCookie(response, accessToken);

        response.writeHead(200);
        response.end(JSON.stringify({userId, accessToken, refreshToken}));
    } else {
        response.writeHead(400);
        response.end(SignInException.INVALID_PASSWORD);
    }
});