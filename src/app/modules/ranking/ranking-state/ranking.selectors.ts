import { createPropertySelectors } from '@ngxs/store';
import { RankingStateModel } from '../models';
import { RankingState } from './ranking.state';

export class RankingSelectors {
    public static slices = createPropertySelectors<RankingStateModel>(RankingState);

    // @Selector([RankingSelectors.slices.selectedCircle, UserSelectors.slices.user])
    // public static canVote(selectedCircle: Circle | undefined, user: User | undefined): boolean {
    //     if (!selectedCircle && !user) {
    //         return false;
    //     }
    //
    //     const userIdentityId = user!.identityId;
    //     const userVoter = selectedCircle!.voters.find(voter => voter.voter === userIdentityId);
    //
    //     if (!userVoter) {
    //         return false;
    //     }
    //
    //     return userVoter.votedFor === null;
    // }
}
