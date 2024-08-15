import { Icon, IconObject, LoadedIconObject } from "./icon";
import fs from "fs";

try {
    const data = fs.readFileSync("../assets/icons.json");
    const icons: LoadedIconObject[] = [];
    const iconPaths = Object.entries(JSON.parse(data.toString())) as IconObject[];
    for (const i in iconPaths) {
        icons.push(Icon.parse(iconPaths[i]).load());
    }

    fs.writeFileSync("../assets/icons-dist.json", JSON.stringify(icons));
} catch (error) {
    console.error("Failed to build by asset files building exception.", error);
}