
// 이 클래스는 로컬을 기반으로 하는 모든 저장 기능들을 통합적으로 관리합니다.
export class Storage {
    static set<T = any>(key: string, value: T) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    static get<T = any>(key: string): T {
        const value = localStorage.getItem(key);
        if (value == null) {
            return null;
        }

        return JSON.parse(value);
    }
}