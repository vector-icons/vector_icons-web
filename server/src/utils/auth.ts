import { randomBytes } from "crypto";
import { REDIS_CLIENT } from "../http";
import { IncomingMessage } from "http";
import * as cookie from "cookie";

export class AuthUtil {
    static ACCESS_TOKEN_EXPIER_DURATION = 604800; // 1 weak
    static REFRESH_TOKEN_EXPIER_DURATION = 31104000; // 1 year

    static createNumbers(length: number) {
        return Array.from({length}).map(_ => Math.floor(Math.random() * 10)).join("");
    }

    /**
     * Generates a unique identifier in a 32-byte (256-bit) format, as UUID v4,
     * which are universally used within the server (DB), may be vulnerable to
     * brute force attacks due to the nature of the token.
     */
    static createToken() {
        return randomBytes(32).toString("hex");
    }

    static async userIdOf(request: IncomingMessage) {
        if (request.headers.cookie) {
            const accessToken = cookie.parse(request.headers.cookie).accessToken;
            return accessToken ? await REDIS_CLIENT.hGet("AccessToken", accessToken) : undefined;
        }
    }
}