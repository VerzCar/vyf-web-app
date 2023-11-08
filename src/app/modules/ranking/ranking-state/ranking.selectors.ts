import { createPropertySelectors, Selector } from '@ngxs/store';
import { User } from '@vyf/user-service';
import { Circle } from '@vyf/vote-circle-service';
import { UserSelectors } from '../../user/user-state/user.selectors';
import { RankingStateModel } from '../models';
import { RankingState } from './ranking.state';

export class RankingSelectors {
    static slices = createPropertySelectors<RankingStateModel>(RankingState);

    @Selector([RankingSelectors.slices.selectedCircle, UserSelectors.slices.user])
    static canVote(selectedCircle: Circle | undefined, user: User | undefined): boolean {
        if (!selectedCircle && !user) {
            return false;
        }

        const userIdentityId = user!.identityId;
        const userVoter = selectedCircle!.voters.find(voter => voter.voter === userIdentityId);

        if (!userVoter) {
            return false;
        }

        return userVoter.votedFor === null;
    }
}
