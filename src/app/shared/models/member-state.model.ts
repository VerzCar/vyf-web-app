import { Member } from './member.model';

export interface MemberStateModel {
    // The members are all selected anf filtered voters aggregated with the associated user
    // from the selected circle.
    members: Member[] | undefined;
    // The member is the voter (current user) for the selected circle aggregated with the associated user
    userMember: Member | undefined;
}
