const domainName = 'Info';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace InfoAction {
    export class FetchCirclesWithOpenCommitment {
        public static readonly type = `[${domainName}] - Fetch open commitments`;
    }
}

export const InfoErrorTrackedActions = [
    InfoAction.FetchCirclesWithOpenCommitment
];
