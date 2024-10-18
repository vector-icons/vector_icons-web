import http from "http";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import { HTTPRouter } from "./core/http_router";
import { HTTPHandler } from "./core/http_handler";
import { PathUtil } from "../utils/path";
import { HTTPConnection } from "./core/http_connection";

const contentTypeOf = (path: string) => {
    return mime.lookup(path) || "application/octet-stream";
}

const server = http.createServer((request, response) => {
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

                response.writeHead(200, {"Content-Type": contentTypeOf(srcPath)});
                response.end(data);
            }
        });
    } else {
        fs.readFile("../client/dist/index.html", "utf8", (err, data) => {
            response.writeHead(200, {"Content-Type": contentTypeOf("html")});
            response.end(data);
        });
    }
});

server.listen(8080);

new HTTPRouter("api", undefined, [
    new HTTPRouter("sign-in", new HTTPHandler((request, response) => console.log("sign-in requested"))),
    new HTTPRouter("sign-up", new HTTPHandler((request, response) => console.log("sign-up requested")))
]);