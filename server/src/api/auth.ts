import { PG_CLIENT, REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";
import { PathUtil } from "../utils/path";
import { UUID } from "../utils/uuid";
import { APIException } from "./components/http";
import { User } from "./components/user";
import { SignUpException, SignUpRequest } from "./sign_up";
import { createHash, randomBytes } from "crypto";

interface AuthData extends SignUpRequest {
    numbers: string;
}

interface AuthRequest {
    numbers: string;
}

enum AuthException {
    INVALID_UUID = "invalid_uuid",
    INVALID_NUMBERS = "invalid_numbers"
}

export const AUTH_HTTP_HANDLER = new HTTPHandler(async (request, response, requestBody) => {
    // Ignore the request because the request for get method cannot define the body.
    if (request.method == "GET") {
        response.writeHead(400);
        response.end();
        return;
    }

    const uuid = PathUtil.toUrl(request.url!).searchParams.get("uuid");
    if (!uuid) {
        response.writeHead(400);
        response.end(APIException.MISSING_REQUEST_FORMAT);
        return;
    }

    // Is not exists user sign-up information corresponding to a given uuid.
    const rawAuthData = await REDIS_CLIENT.hGet("Auth", uuid!);
    if (!rawAuthData) {
        response.writeHead(400);
        response.end(AuthException.INVALID_UUID);
        return;
    }

    try {
        const authRequest = JSON.parse(rawAuthData!) as AuthData;
        const requestData = JSON.parse(requestBody) as AuthRequest;

        if (!requestData.numbers) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        if (requestData.numbers == authRequest.numbers) {
            if (await User.existsEmail(authRequest.email)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_EMAIL);
                return;
            }

            if (await User.existsAlias(authRequest.alias)) {
                response.writeHead(400);
                response.end(SignUpException.ALREADY_EXISTS_ALIAS);
                return;
            }

            const userId = UUID.v4();
            const alias = authRequest.alias;
            const email = authRequest.email;
            const displayName = authRequest.displayName;
            const passSalt = createHash("sha256").update(randomBytes(128)).digest("base64");
            const password = createHash("sha512").update(authRequest.password + passSalt).digest("base64");
            const accessToken = AuthUtil.createToken();
            const refreshToken = AuthUtil.createToken();

            PG_CLIENT.query(`INSERT INTO "User"("id", "createdAt", "displayName", "alias", "email", "password", "passwordSalt") VALUES($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6)`, [
                userId,
                displayName,
                alias,
                email,
                password,
                passSalt
            ]);

            // Authorization uuid must expire because sign-up tasks has finally been completed.
            REDIS_CLIENT.hDel("Auth", uuid);

            REDIS_CLIENT.hSet("AccessToken", accessToken, userId);
            REDIS_CLIENT.hExpire("AccessToken", accessToken, 604800); // 1 weak

            REDIS_CLIENT.hSet("RefreshToken", refreshToken, userId);
            REDIS_CLIENT.hExpire("RefreshToken", refreshToken, 31104000); // 1 year

            response.writeHead(200);
            response.end(JSON.stringify({
                access_token: accessToken,
                refresh_token: refreshToken
            }));
        } else {
            response.writeHead(400);
            response.end(AuthException.INVALID_NUMBERS);
        }
    } catch (_) {
        response.writeHead(400);
        response.end(APIException.INVALID_REQUEST_FORMAT);
    }
});