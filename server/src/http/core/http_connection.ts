import http from "http";

export class HTTPConnection {
    constructor(
        public paths: string[],
        public request: http.IncomingMessage,
        public response: http.ServerResponse
    ) {}

    get fristPath() {
        return this.paths[0];
    }

    consume(): HTTPConnection {
        this.paths = this.paths.length == 1 ? [] : this.paths.slice(-1);
        return this;
    }
}