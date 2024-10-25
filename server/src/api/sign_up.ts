import { PG_CLIENT } from "../http";
import { HTTPHandler } from "../http/core/http_handler";

export const SIGN_UP_HTTP_HANDLER = new HTTPHandler((request, response) => {
    console.log("Hello, World! (sign-up)");

    PG_CLIENT.query(`SELECT * FROM "User"`).then(data => {
        console.log(data.rows);
    })
});