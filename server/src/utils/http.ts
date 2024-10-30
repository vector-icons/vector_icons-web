import { ServerResponse } from "http";
import mime from "mime-types";
import { APIException } from "../api/components/http";

export class HTTPUtil {
    static contentTypeOf(path: string) {
        return mime.lookup(path) || "application/octet-stream";
    }

    static parseRequest<T>(text: string, response: ServerResponse): T | null {
        try {
            return JSON.parse(text) as T;
        } catch {
            response.writeHead(400);
            response.end(APIException.INVALID_REQUEST_FORMAT);
            return null;
        }
    }
}