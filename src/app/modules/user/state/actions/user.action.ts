import { User } from '@vyf/user-service';
import { CirclesAction } from '../../../circles/state/actions/circles.action';

const domainName = 'User';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserAction {
    export class FetchUser {
        public static readonly type = `[${domainName}] Fetch User`;
    }

    export class UpdateProfileImage {
        public static readonly type = `[${domainName}] Update profile image`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public image: File) {
        }
    }

    export class UpdateUser {
        public static readonly type = `[${domainName}] Update user`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public user: Partial<User>) {
        }
    }
}

export const UserErrorTrackedActions = [
    UserAction.FetchUser,
    UserAction.UpdateProfileImage,
    UserAction.UpdateUser
]
