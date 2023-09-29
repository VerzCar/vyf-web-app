export interface CognitoUser {
  id: string | undefined;
  attributes: {
	sub: string;
	email_verified: boolean;
	preferred_username: string;
	email: string;
  };
  username: string;
}
