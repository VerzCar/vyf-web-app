import { CircleCreateRequest } from '@vyf/vote-circle-service';

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

    export class FetchMyCircles {
        public static readonly type = `[${domainName}] Fetch My Circles`;
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
}
