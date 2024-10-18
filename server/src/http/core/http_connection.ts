import http from "http";

export class HTTPConnection {
    constructor(
        public paths: string[],
        public request: http.IncomingMessage,
        public response: http.ServerResponse
    ) {}

    consume(): HTTPConnection {
        return this.paths = this.paths.slice(0, 1), this;
    }
}