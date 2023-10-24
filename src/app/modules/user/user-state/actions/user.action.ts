const domainName = 'User';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserAction {
    export class FetchUser {
        public static readonly type = `[${domainName}] Fetch User`;

        constructor() {
            // not used
        }
    }

    export class UpdateProfileImage {
        public static readonly type = `[${domainName}] Update profile image`;

        constructor(public image: File) {}
    }
}
