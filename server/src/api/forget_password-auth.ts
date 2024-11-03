import { createHash, randomBytes } from "crypto";
import { PG_CLIENT, REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { HTTPUtil } from "../utils/http";
import { PathUtil } from "../utils/path";
import { APIException } from "./components/http";

interface AuthData {
    userId: string;
    numbers: string;
    password: string;
}

interface AuthRequest {
    numbers: string;
}

enum AuthException {
    INVALID_UUID = "invalid_uuid",
    INVALID_NUMBERS = "invalid_numbers"
}

export const FORGET_PASSWORD_AUTH_HTTP_HANDLER = new HTTPHandler({
    post: async (request, response, requestBody) => {
        const given = HTTPUtil.parseRequest<AuthRequest>(requestBody, response);
        if (!given) return;

        const uuid = PathUtil.toUrl(request.url!).searchParams.get("uuid");
        if (!uuid) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        // Is not exists user sign-up information corresponding to a given uuid.
        const rawAuthData = await REDIS_CLIENT.hGet("ForgetPasswordAuth", uuid!);
        if (!rawAuthData) {
            response.writeHead(400);
            response.end(AuthException.INVALID_UUID);
            return;
        }

        const authRequest = JSON.parse(rawAuthData!) as AuthData;
        const requestData = HTTPUtil.parseRequest<AuthRequest>(requestBody, response);
        if (!requestData) return;
        if (!requestData.numbers) {
            response.writeHead(400);
            response.end(APIException.MISSING_REQUEST_FORMAT);
            return;
        }

        const passSalt = createHash("sha256").update(randomBytes(128)).digest("base64");
        const password = createHash("sha512").update(authRequest.password + passSalt).digest("base64");

        PG_CLIENT.query(`UPDATE "User" SET "password" = $1, "passwordSalt" = $2 WHERE "id" = $3`, [
            password,
            passSalt,
            authRequest.userId
        ]);

        // Authorization uuid must expire because forget password tasks has finally been completed.
        REDIS_CLIENT.hDel("ForgetPasswordAuth", uuid);

        response.writeHead(200);
        response.end(JSON.stringify({userId: authRequest.userId}));
    }
});