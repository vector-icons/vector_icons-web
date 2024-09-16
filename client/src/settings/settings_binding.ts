
export class SettingsBinding {
    static globalKey: string = "settings";

    static globalOf(key: string) {
        return `${this.globalKey}-${key}`;
    }

    static getValue(key: string) {
        return localStorage.getItem(this.globalOf(key));
    }

    static setValue(key: string, value: string) {
        if (value == null) {
            return localStorage.removeItem(this.globalOf(key));
        } else {
            return localStorage.setItem(this.globalOf(key), value);
        }
    }
}