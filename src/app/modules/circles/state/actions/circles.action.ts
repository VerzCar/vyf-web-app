import { CircleCreateRequest, Commitment } from '@vyf/vote-circle-service';

const domainName = 'Circles';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CirclesAction {
    export class FetchCircle {
        public static readonly type = `[${domainName}] Fetch Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class FetchCircles {
        public static readonly type = `[${domainName}] Fetch Circles`;
    }

    export class FetchCirclesOfInterest {
        public static readonly type = `[${domainName}] Fetch Circles of interest`;
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
}
