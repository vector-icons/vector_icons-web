import { Storage } from "./storage";

export class User {
    // 북마크된 아이콘의 이름을 리스트 형태로 반환합니다.
    static get markedIcons(): string[] {
        return Storage.get("user-marked_icons") ?? [];
    }

    static set markedIcons(values: string[]) {
        Storage.set("user-marked_icons", values);
    }
}