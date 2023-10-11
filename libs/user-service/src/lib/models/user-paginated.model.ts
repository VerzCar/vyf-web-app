import { ProfilePaginated } from './profile-paginated.model';

export interface UserPaginated {
    identityId: string;
    username: string;
    profile: ProfilePaginated;
}
