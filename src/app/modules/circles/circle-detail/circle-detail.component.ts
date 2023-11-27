import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { CircleMemberComponentOption } from '@vyf/component';
import { UserService } from '@vyf/user-service';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { Member } from '../../../shared/models';
import { CircleMemberSelectors } from '../../../shared/state/circle-member.selectors';
import { CirclesAction } from '../state/actions/circles.action';
import { CirclesSelectors } from '../state/circles.selectors';

interface CircleDetailView {
    circle: Circle;
    owner: Member;
    members: Member[];
    membersCount: number;
    disabled: boolean;
}

@Component({
    selector: 'app-circle-detail',
    templateUrl: './circle-detail.component.html',
    styleUrls: ['./circle-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleDetailComponent {
    public readonly placeholderImageSrc = 'assets/img/placeholder-image.jpg';

    public readonly circleMemberComponentOption: Partial<CircleMemberComponentOption> = {
        show: {
            username: true,
            commitment: false
        }
    };

    public readonly circleMembersComponentOption: Partial<CircleMemberComponentOption> = {
        show: {
            username: false,
            commitment: false
        }
    };

    public hasOpenCommitment$: Observable<boolean>;
    public view$: Observable<CircleDetailView>;

    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    private readonly maxMembersCount = 3;

    constructor() {
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CircleMemberSelectors.slices.members)
        ]).pipe(
            filter(([circle, members]) => isDefined(circle) && isDefined(members)),
            map(([c, m]) => {
                const circle = c as Circle;
                const members = m as Member[];
                const circleMembers = this.circleMembers(members);
                const membersCount = this.membersCount(members);
                const owner = this.owner(circle.createdFrom, members);

                return {
                    circle: circle as Circle,
                    owner,
                    members: circleMembers,
                    membersCount,
                    disabled: !this.store.selectSnapshot(CirclesSelectors.canEditCircle)
                };
            })
        );

        this.hasOpenCommitment$ = this.store.select(CircleMemberSelectors.hasOpenCommitment);
    }

    public hasCommitted(circleId: number, commitment: Commitment) {
        this.store.dispatch(new CirclesAction.CommittedToCircle(circleId, commitment));
    }

    private owner(createdFrom: string, members: Member[]): Member {
        const circleOwnerVoter = members.find(member => member.voter.voter === createdFrom);

        if (!circleOwnerVoter) {
            throw Error('createFrom does not exist in circle voters');
        }

        return circleOwnerVoter;
    }

    private circleMembers(members: Member[]): Member[] {
        if (!members.length) {
            return [];
        }

        return members.slice(0, this.maxMembersCount);
    }

    private membersCount(members: Member[]): number {
        if (!members.length) {
            return 0;
        }
        const membersCount = members.length - this.maxMembersCount;
        return membersCount > 0 ? membersCount : 0;
    }

}
