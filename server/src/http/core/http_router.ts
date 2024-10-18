import { HTTPConnection } from "./http_connection";
import { HTTPHandler } from "./http_handler";

export class HTTPRouter {
    constructor(
        public path: string,
        public handler?: HTTPHandler,
        public children?: HTTPRouter[]
    ) {}

    static consume(paths: string[]) {
        return paths.splice(0, 1);
    }

    /** Delegates the response task to the http-handler corresponding to the user request path. */
    handle(connection: HTTPConnection) {
        const paths = connection.paths;

        if (paths.length != 0 && this.children != null) {
            const targetPath = paths[0];
            const target = this.children.find(child => child.path == targetPath);
            target?.handle(connection.consume());
        } {
            if (this.handler == null) {
                throw new Error(`Not exsists the http-handler to handle the '${paths}' path`);
            }

            this.handler.callback(connection.request, connection.response);
        }
    }
}