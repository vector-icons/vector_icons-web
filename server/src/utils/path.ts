
export class PathUtil {
    static toList(path: string) {
        return Array.from(path.matchAll(/[\w-]+(?=\/?)/g)).map(e => e[0]);
    }
}