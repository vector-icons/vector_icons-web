import { HTTPHandler } from "../http/core/http_handler";
import { HTTPUtil } from "../utils/http";

interface ForgetPasswordRequest {
    email: string;
    alias: string;
}

export const FORGET_PASSWORD_AUTH_HTTP_HANDLER = new HTTPHandler({
    post: (request, response, requestBody) => {
        const given = HTTPUtil.parseRequest(requestBody, response);
        if (given == null) {
            return;
        }
    }
});