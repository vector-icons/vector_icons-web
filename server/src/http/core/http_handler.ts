import http from "http";
import { HTTPConnection } from "./http_connection";

export type HTTPHandlerCallback = {
    put?: HTTPHandlerListener;
    get?: HTTPHandlerListener;
    head?: HTTPHandlerListener;
    post?: HTTPHandlerListener;
    patch?: HTTPHandlerListener;
    delete?: HTTPHandlerListener;
}

export type HTTPHandlerListener = (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    requestBody: string
) => Promise<void> | void;

export class HTTPHandler {
    constructor(public callback: HTTPHandlerCallback) {}

    /** Delegates the response task to this handler by a given http-connection. */
    delegate(connection: HTTPConnection) {
        const request = connection.request;
        const response = connection.response;

        let body = "";
        request.on("data", chunk => body += chunk);
        request.on("end", async () => {
            try {
                const method = request?.method?.toLowerCase() as "put" | "get" | "head" | "post" | "patch" | "delete";
                if (method in this.callback && this.callback[method]) {
                    await this.callback[method](request, response, body);
                    return;
                }

                response.writeHead(405);
                response.end();
            } catch {
                response.writeHead(500);
                response.end();
            }
        });
    }
}