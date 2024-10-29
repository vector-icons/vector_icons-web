import * as uuid from "uuid";

export class UUID {
    /** Generates a unique id in a universal format like UUID v4. */
    static v4() {
        return uuid.v4();
    }
}