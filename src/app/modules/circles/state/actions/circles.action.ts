import { CircleCreateRequest, CircleUpdateRequest, Commitment } from '@vyf/vote-circle-service';

const domainName = 'Circles';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CirclesAction {
    export class FetchCircle {
        public static readonly type = `[${domainName}] Fetch Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class FetchUserOption {
        public static readonly type = `[${domainName}] Fetch User Option`;
    }

    export class FetchCircles {
        public static readonly type = `[${domainName}] Fetch Circles`;
    }

    export class FetchCirclesOfInterest {
        public static readonly type = `[${domainName}] Fetch Circles of interest`;
    }

    export class FetchCircleOwner {
        public static readonly type = `[${domainName}] Fetch Circle Owner`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public userIdentityId: string) {
        }
    }

    export class InitUserCircles {
        public static readonly type = `[${domainName}] Init Circles of user`;
    }

    export class SelectCircle {
        public static readonly type = `[${domainName}] Select Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class CreateCircle {
        public static readonly type = `[${domainName}] Create Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circle: CircleCreateRequest) {
        }
    }

    export class UpdateCircle {
        public static readonly type = `[${domainName}] Update Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circle: CircleUpdateRequest) {
        }
    }

    export class DeleteCircle {
        public static readonly type = `[${domainName}] Delete Circle`;
    }

    export class UpdateCircleImage {
        public static readonly type = `[${domainName}] Update circle image`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public image: File) {
        }
    }

    export class CommittedToCircle {
        public static readonly type = `[${domainName}] Placed commitment for circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public commitment: Commitment) {
        }
    }

    export class JoinCircleAsVoter {
        public static readonly type = `[${domainName}] Join Circle as voter`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class JoinCircleAsCandidate {
        public static readonly type = `[${domainName}] Join Circle as candidate`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class AddCandidate {
        public static readonly type = `[${domainName}] Add Candidate to circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public userIdentityId: string) {
        }
    }

    export class AddVoter {
        public static readonly type = `[${domainName}] Add Voter to circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public userIdentityId: string) {
        }
    }

    export class LeaveCircleAsCandidate {
        public static readonly type = `[${domainName}] Leave Circle as candidate`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class LeaveCircleAsVoter {
        public static readonly type = `[${domainName}] Leave Circle as voter`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }
}

export const CirclesErrorTrackedActions = [
    CirclesAction.CreateCircle,
    CirclesAction.UpdateCircle,
    CirclesAction.DeleteCircle,
    CirclesAction.UpdateCircleImage,
    CirclesAction.SelectCircle,
    CirclesAction.CommittedToCircle,
    CirclesAction.AddCandidate,
    CirclesAction.JoinCircleAsVoter,
    CirclesAction.JoinCircleAsCandidate,
    CirclesAction.LeaveCircleAsCandidate
];
