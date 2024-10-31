import http from "http";
import { HTTPConnection } from "./http_connection";

export type HTTPHandlerListener = (
    request: http.IncomingMessage,
    response: http.ServerResponse,
    requestBody: string
) => Promise<void> | void;

export class HTTPHandler {
    constructor(public callback: HTTPHandlerListener) {}

    /** Delegates the response task to this handler by a given http-connection. */
    delegate(connection: HTTPConnection) {
        let body = "";
        connection.request.on("data", chunk => body += chunk);
        connection.request.on("end", async () => {
            try {
                await this.callback(connection.request, connection.response, body);
            } catch {
                connection.response.writeHead(500);
                connection.response.end();
            }
        });
    }
}