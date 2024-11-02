import { API } from "./api";

export enum MyUserStatus {
    NONE,
    LOADING,
    LOADED
}

/** Signature for the function that is called when the status of [MyUser] changes. */
export type MyUserListener = (status: MyUserStatus) => void;

export class MyUser {
    static status: MyUserStatus = MyUserStatus.NONE;
    static statusListeners: MyUserListener[] = [];

    static profile: API.MyProfile;

    static load() {

    }

    static addStatusListener(listener: MyUserListener) {
        console.assert(!this.statusListeners.includes(listener), "Already a given listener attached.");
        this.statusListeners.push(listener);
    }

    static removeStatusListener(listener: MyUserListener) {
        console.assert(this.statusListeners.includes(listener), "Already not a given listener attached.");
        this.statusListeners = this.statusListeners.filter(l => l != listener);
    }
}