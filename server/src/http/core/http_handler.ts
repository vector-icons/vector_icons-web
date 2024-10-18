import http from "http";

export class HTTPHandler {
    constructor(
        public callback: http.RequestListener,
    ) {}
}