
export class SettingsBinding {
    static globalKey: string = "settings";

    static getKey(key: string) {
        return `${this.globalKey}-${key}`;
    }

    static getValue(key: string) {
        return localStorage.getItem(this.getKey(key));
    }

    static setValue(key: string, value: string) {
        return localStorage.setItem(this.getKey(key), value);
    }
}