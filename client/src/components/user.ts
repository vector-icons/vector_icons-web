import { Storage } from "./storage";

export interface UserAccount {
    userId: string;
    accessToken: string;
    refreshToken: string;
}

export class User {
    // 북마크된 아이콘의 이름을 리스트 형태로 반환합니다.
    static get markedIcons(): string[] {
        return Storage.get("user-marked_icons") ?? [];
    }

    static set markedIcons(values: string[]) {
        Storage.set("user-marked_icons", values);
    }

    static get accounts() {
        return Storage.get("user-accounts") ?? [];
    }

    static signIn(data: UserAccount) {
        Storage.set("user-accounts", [...this.accounts, data]);
        Storage.set("user-activeId", data.userId);
    }
}