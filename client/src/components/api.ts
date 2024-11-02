
/** Refer to [Docs API](https://docs.quarkicons.com/) for details. */
export namespace API {
    export interface Account {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }

    export interface Profile {
        displayName: string;
        email: string;
        alias: string;
        profileImage: string; // URL
        profileColor: string; // RGB
    }

    export interface MyProfile extends Profile {
        bookmarkedIcons: string[],
        downloadedIcons: string[]
    }
}