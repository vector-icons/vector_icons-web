import http from "http";
import fs from "fs";
import path from "path";
import { HTTPRouter } from "./core/http_router";
import { SIGN_IN_HTTP_HANDLER } from "../api/sign_in";
import { SIGN_UP_HTTP_HANDLER } from "../api/sign_up";
import { HTTPHandler } from "./core/http_handler";
import { HTTPUtil } from "../utils/http";
import { HTTPConnection } from "./core/http_connection";
import { PathUtil } from "../utils/path";

const RESOURCE_HTTP_HANDLER = new HTTPHandler((request, response) => {
    if (request.url === undefined) return;

    const ext = path.extname(request.url);

    // If the file extension does not exist,
    // it will respond with `index.html` due to the characteristics of SPA.
    if (request.method == "GET" && ext != "") {
        const srcPath = path.join("../client/dist", path.normalize(request.url));

        fs.readFile(srcPath, null, (err, data) => {
            if (err) { // Is not found or other errors occur.
                response.writeHead(404);
                response.end();
            } else {
                // A response about a user request will be cached for about a year.
                // when request a user to font files (e.g. ttf, otf).
                if (ext == ".ttf"
                 || ext == ".otf"
                 || ext == ".woff"
                 || ext == ".woff2") {
                    response.setHeader("Cache-Control", "max-age=31536000, public");
                }

                response.writeHead(200, {"Content-Type": HTTPUtil.contentTypeOf(srcPath)});
                response.end(data);
            }
        });
    } else {
        fs.readFile("../client/dist/index.html", "utf8", (err, data) => {
            response.writeHead(200, {"Content-Type": HTTPUtil.contentTypeOf("html")});
            response.end(data);
        });
    }
});

const HTTP_ROUTER = new HTTPRouter("api", RESOURCE_HTTP_HANDLER, [
    new HTTPRouter("sign-in", SIGN_IN_HTTP_HANDLER),
    new HTTPRouter("sign-up", SIGN_UP_HTTP_HANDLER)
]);

const server = http.createServer((request, response) => {
    if (request.url === undefined) return;

    HTTP_ROUTER.delegate(new HTTPConnection(
        PathUtil.toList(request.url),
        request,
        response
    ))
});

server.listen(8080);