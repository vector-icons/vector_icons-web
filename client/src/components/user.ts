import { API } from "./api";
import { Storage } from "./storage";

export class User {
    // 북마크된 아이콘의 이름을 리스트 형태로 반환합니다.
    static get markedIcons(): string[] {
        return Storage.get("user-marked_icons") ?? [];
    }

    static set markedIcons(values: string[]) {
        Storage.set("user-marked_icons", values);
    }

    // 사용자가 다운로드한 모든 아이콘의 이름을 리스트 형태로 반환합니다.
    static get downloadedIcons(): string[] {
        return Storage.get("user-downloaded_icons") ?? [];
    }

    static set downloadedIcons(values: string[]) {
        Storage.set("user-downloaded_icons", values)
    }

    static get accounts(): API.Account[] {
        return Storage.get("user-accounts") ?? [];
    }

    static get isSignIned() {
        return Storage.get("user-activeId") ? true : false;
    }

    static signIn(data: API.Account) {
        Storage.set("user-accounts", [...this.accounts.filter(e => e.userId != data.userId), data]);
        Storage.set("user-activeId", data.userId);
    }
}