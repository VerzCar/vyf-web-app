import { Candidate, CircleCandidatesFilter, CircleVotersFilter, Commitment, Voter } from '@vyf/vote-circle-service';

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
            public static readonly type = `[${domainName}] Vote`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public candidateIdentId: string) {
            }
        }
    }

    export class Committed {
        public static readonly type = `[${domainName}] - Placed commitment for circle as candidate`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public commitment: Commitment) {
        }
    }

    export class JoinedAsVoter {
        public static readonly type = `[${domainName}] Joined circle as voter`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public voter: Voter) {
        }
    }

    export class JoinedAsCandidate {
        public static readonly type = `[${domainName}] Joined circle as candidate`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public candidate: Candidate) {
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
    MemberAction.Ranking.Vote,
];

export const MemberErrorTrackedActions = [
    MemberAction.JoinedAsCandidate,
    MemberAction.JoinedAsVoter,
    MemberAction.Committed
];
