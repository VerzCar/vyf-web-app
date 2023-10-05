const domainName = 'User';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserAction {
  export class FetchUser {
      public static readonly type = `[${domainName}] Fetch User`;
	constructor() {
	  // not used
	}
  }
}
