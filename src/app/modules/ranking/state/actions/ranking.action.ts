import { Ranking } from '@vyf/vote-circle-service';
import { CirclesAction } from '../../../circles/state/actions/circles.action';

const domainName = 'Ranking';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace RankingAction {
    export class FetchCircle {
        public static readonly type = `[${domainName}] Fetch Circle`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number) {
        }
    }

    export class FetchRankings {
        public static readonly type = `[${domainName}] Fetch Rankings`;

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

    export class SubscribeRankingsChangeEvent {
        public static readonly type = `[${domainName}] Subscribe to rankings change event`;
    }

    export class RankingChanged {
        public static readonly type = `[${domainName}] Ranking changed`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public ranking: Ranking) {
        }
    }
}

export const RankingErrorTrackedActions = [
    RankingAction.FetchCircle,
    RankingAction.FetchRankings,
    RankingAction.SelectCircle
]
