const domainName = 'Ranking';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RankingAction {
    export class FetchCircle {
        public static readonly type = `[${domainName}] Fetch Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class SelectCircle {
        public static readonly type = `[${domainName}] Select Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class Vote {
        public static readonly type = `[${domainName}] Vote`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public electedIdentId: string) {
        }
    }
}
