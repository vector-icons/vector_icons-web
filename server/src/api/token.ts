import { REDIS_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";
import { AuthUtil } from "../utils/auth";
import { HTTPUtil } from "../utils/http";
import { APIException } from "./components/http";

interface TokenRequest {
    refreshToken: string;
}

enum TokenException {
    INVALID_REFRESH_TOKEN = "invalid_refresh_token"
}

export const TOKEN_HTTP_HANDLER = new HTTPHandler(async (request, response, requestBody) => {
    // Ignore the request because the request for get method cannot define the body.
    if (request.method != "POST") {
        response.writeHead(400);
        response.end(APIException.INVALID_REQUEST_METHOD);
        return;
    }

    const given = HTTPUtil.parseRequest<TokenRequest>(requestBody, response);
    if (given == null) return;

    // A refresh token is required when creating an access token.
    if (given.refreshToken) {
        const userId = await REDIS_CLIENT.hGet("RefreshToken", given.refreshToken);

        // Is the given refresh token is invalid.
        if (!userId) {
            response.writeHead(400);
            response.end(TokenException.INVALID_REFRESH_TOKEN);
            return;
        }

        const accessToken = AuthUtil.createToken();

        REDIS_CLIENT.hSet("AccessToken", accessToken, userId);
        REDIS_CLIENT.hExpire("AccessToken", accessToken, AuthUtil.ACCESS_TOKEN_EXPIER_DURATION);

        response.writeHead(200);
        response.end(accessToken);
    } else {
        response.writeHead(400);
        response.end(APIException.MISSING_REQUEST_FORMAT);
    }
});