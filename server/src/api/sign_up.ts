import { HTTPHandler } from "../http/core/http_handler";

export const SIGN_UP_HTTP_HANDLER = new HTTPHandler((request, response) => {
    console.log("Hello, World! (sign-up)");
});