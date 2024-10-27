
export class PathUtil {
    static toUrl(path: string) {
        return new URL(path, "http://localhost");
    }

    static toList(path: string) {
        const pathname = this.toUrl(path).pathname;
        const matcheds = Array.from(pathname.matchAll(/(?<=\/)[\w-]+/g)).map(e => e[0]);
        return matcheds;
    }
}