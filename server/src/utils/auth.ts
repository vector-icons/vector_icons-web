import { randomBytes } from "crypto";

export class AuthUtil {
    static ACCESS_TOKEN_EXPIER_DURATION = 604800; // 1 weak
    static REFRESH_TOKEN_EXPIER_DURATION = 31104000; // 1 year

    static createNumbers(length: number) {
        return Array.from({length}).map(_ => Math.floor(Math.random() * 10)).join("");
    }

    static createToken() {
        return randomBytes(32).toString("hex");
    }
}