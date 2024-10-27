import { randomBytes } from "crypto";

export class AuthUtil {
    static createNumbers(length: number) {
        return Array.from({length}).map(_ => Math.floor(Math.random() * 10)).join("");
    }

    static createToken() {
        return randomBytes(32).toString("hex");
    }
}