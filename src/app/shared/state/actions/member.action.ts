import { Candidate, CircleCandidateChangeEvent, CircleCandidatesFilter, CircleVotersFilter, Commitment, Voter } from '@vyf/vote-circle-service';

const domainName = 'Member';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace MemberAction {

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Circle {
        const subDomainName = 'Circle';

        export class FetchVoter {
            public static readonly type = `[${domainName}] - [${subDomainName}] Fetch Circle Voter`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public filter?: Partial<CircleVotersFilter>) {
            }
        }

        export class FetchCandidate {
            public static readonly type = `[${domainName}] - [${subDomainName}] Fetch Circle Candidate`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public filter?: Partial<CircleCandidatesFilter>) {
            }
        }

        export class FilterVoterMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter voter members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public votersFilter?: Partial<CircleVotersFilter>) {
            }
        }

        export class FilterCandidateMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter candidate members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public candidatesFilter?: Partial<CircleCandidatesFilter>) {
            }
        }

        export class CandidateChanged {
            public static readonly type = `[${domainName}] - [${subDomainName}] Candidate changed`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public candidateEvent: CircleCandidateChangeEvent) {
            }
        }

        export class SubscribeCandidateChangeEvent {
            public static readonly type = `[${domainName}] - [${subDomainName}] Subscribe to candidate change event`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number) {
            }
        }

        export class UnsubscribeCandidateChangeEvent {
            public static readonly type = `[${domainName}] - [${subDomainName}] Unsubscribe to candidate change event`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number) {
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-namespace
    export namespace Ranking {
        const subDomainName = 'Ranking';

        export class FetchVoter {
            public static readonly type = `[${domainName}] - [${subDomainName}] Fetch Circle Voter`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public filter?: Partial<CircleVotersFilter>) {
            }
        }

        export class FetchCandidate {
            public static readonly type = `[${domainName}] - [${subDomainName}] Fetch Circle Candidate`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public filter?: Partial<CircleCandidatesFilter>) {
            }
        }

        export class FilterVoterMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public votersFilter?: Partial<CircleVotersFilter>) {
            }
        }

        export class FilterCandidateNeedVoteMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter candidate need vote members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public candidatesFilter?: Partial<CircleCandidatesFilter>) {
            }
        }

        export class Vote {
            public static readonly type = `[${domainName}] - [${subDomainName}] Vote`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public candidateIdentId: string) {
            }
        }

        export class CandidateChanged {
            public static readonly type = `[${domainName}] - [${subDomainName}] Candidate changed`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public candidateEvent: CircleCandidateChangeEvent) {
            }
        }

        export class SubscribeCandidateChangeEvent {
            public static readonly type = `[${domainName}] - [${subDomainName}] Subscribe to candidate change event`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number) {
            }
        }

        export class UnsubscribeCandidateChangeEvent {
            public static readonly type = `[${domainName}] - [${subDomainName}] Unsubscribe to candidate change event`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number) {
            }
        }
    }

    export class JoinedAsVoter {
        public static readonly type = `[${domainName}] Joined circle as voter`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public voter: Voter) {
        }
    }
}

export const MemberCircleErrorTrackedActions = [
    MemberAction.Circle.FetchVoter,
    MemberAction.Circle.FetchCandidate
];

export const MemberRankingErrorTrackedActions = [
    MemberAction.Ranking.FetchVoter,
    MemberAction.Ranking.FetchCandidate,
    MemberAction.Ranking.Vote
];

export const MemberErrorTrackedActions = [
    MemberAction.JoinedAsVoter,
];
