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

        this.handler.delegate(connection);
    }

    /** Delegates the response task to the http-handler corresponding to the user request path. */
    delegate(connection: HTTPConnection) {
        const paths = connection.paths;

        if (paths.length != 0) {
            const target = this.children?.findLast(e => e.path == paths[0]);

            // If not exists the handler corresponding to the request path,
            // it will be handling itself because of safety routing.
            if (target) {
                target.delegate(connection.consume());
            } else {
                if (this.handler == null) {
                    connection.response.writeHead(404);
                    connection.response.end();
                    return;
                }

                this.handle(connection);
            }
        } else {
            this.handle(connection);
        }
    }

    perform(connection: HTTPConnection) {
        if (connection.paths.length != 0 && this.path == connection.fristPath) {
            this.delegate(connection.consume());
        } else {
            this.handle(connection);
        }
    }
}