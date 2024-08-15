import http from "http";
import fs from "fs";
import path from "path";
import mime from "mime-types";

const contentTypeOf = (path: string) => {
    return mime.lookup(path) || "application/octet-stream";
}

const server = http.createServer((request, response) => {
    if (request.url === undefined) return;

    // If the file extension does not exist,
    // it will respond with `index.html` due to the characteristics of SPA.
    if (request.method == "GET" && /\.\w+$/.test(request.url)) {
        const srcPath = path.join("../client/dist", path.normalize(request.url));

        fs.readFile(srcPath, null, (err, data) => {
            if (err) { // Is not found or other errors occur.
                response.writeHead(404);
                response.end();
            } else {
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