const domainName = 'Circles';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace CirclesAction {
    export class FetchCircle {
        public static readonly type = `[${domainName}] Fetch Circle`;

        constructor(public circleId: number) {}
    }

    export class SelectCircle {
        public static readonly type = `[${domainName}] Select Circle`;

        constructor(public circleId: number) {}
    }
}
