import mime from "mime-types";

export class HTTPUtil {
    static contentTypeOf(path: string) {
        return mime.lookup(path) || "application/octet-stream";
    }
}