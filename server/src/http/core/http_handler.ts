import http from "http";
import { HTTPConnection } from "./http_connection";

export class HTTPHandler {
    constructor(public callback: http.RequestListener) {}

    /** Delegates the response task to this handler by a given http-connection. */
    delegate(connection: HTTPConnection) {
        this.callback(connection.request, connection.response);
    }
}