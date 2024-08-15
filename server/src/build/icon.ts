import fs from "fs";
import path from "path";

export type IconObject = [string, IconByTypeObject];

export type IconByTypeObject = {
    normal?: string,
    filled?: string,
};

export type LoadedIconObject = {
    name: string,
    path: IconByTypeObject
    content: IconByTypeObject
}

export class Icon {
    constructor(
        public name: string,
        public path: IconObject["1"]
    ) {}

    static parse(icon: IconObject) {
        return new Icon(icon[0], icon[1])
    }

    load(): LoadedIconObject {
        const normalPath = path.join("../assets", this.path.normal ?? "");
        const filledPath = path.join("../assets", this.path.filled ?? "");

        const loadedContent = {
            normal: this.path.normal ? fs.readFileSync(normalPath).toString() : undefined,
            filled: this.path.filled ? fs.readFileSync(filledPath).toString() : undefined
        }

        return {
            name: this.name,
            path: this.path,
            content: loadedContent
        }
    }
}