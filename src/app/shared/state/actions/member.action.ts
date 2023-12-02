import { CircleVotersFilter, Commitment } from '@vyf/vote-circle-service';

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

        export class FilterMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public votersFilter: Partial<CircleVotersFilter>) {
            }
        }

        export class Committed {
            public static readonly type = `[${domainName}] - [${subDomainName}] Placed commitment for circle`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public commitment: Commitment) {
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

        export class FilterMembers {
            public static readonly type = `[${domainName}] - [${subDomainName}] Filter members`;

            // eslint-disable-next-line no-useless-constructor
            constructor(public circleId: number, public votersFilter: Partial<CircleVotersFilter>) {
            }
        }
    }

    export class Vote {
        public static readonly type = `[${domainName}] Vote`;

        // eslint-disable-next-line no-useless-constructor
        constructor(public circleId: number, public electedIdentId: string) {
        }
    }
}
