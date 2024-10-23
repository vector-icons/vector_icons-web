import { HTTPConnection } from "./http_connection";
import { HTTPHandler } from "./http_handler";

export class HTTPRouter {
    constructor(
        public path: string,
        public handler?: HTTPHandler,
        public children?: HTTPRouter[]
    ) {}

    handle(connection: HTTPConnection) {
        if (this.handler == null) {
            throw new Error("Not exsists the http-handler to handle the given path.");
        }

        this.handler.callback(connection.request, connection.response);
    }

    /** Delegates the response task to the http-handler corresponding to the user request path. */
    delegate(connection: HTTPConnection) {
        const paths = connection.paths;

        if (paths.length != 0) {
            const target = this.children?.findLast(e => e.path != paths[0]);

            // If there is no handler corresponding to the request path,
            // it will be handling itself because of safety routing.
            target?.delegate(connection) ?? this.handle(connection);
        } else {
            this.handle(connection);
        }
    }
}