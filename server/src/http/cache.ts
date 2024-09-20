
/** Signature for the type that defines a cache instance of `CacheResponse` class. */
export type CacheResponseInstance = {key: string, path: string};

/** This class is used to cache static resources. */
export class CacheResponse {
    private static instances = new WeakMap<{key: string, path: string}, string | Buffer>;

    static get(key: string, path: string) {
        return this.instances.get({key, path});
    }

    static set(key: string, path: string, source: string) {
        return this.instances.set({key, path}, source);
    }
}