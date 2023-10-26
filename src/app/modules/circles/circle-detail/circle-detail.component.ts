import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CircleMemberComponentOption } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { Circle, Voter } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { CirclesSelectors } from '../circles-state/circles.selectors';

interface Member {
    user: User;
    voter: Voter;
}

interface CircleDetailView {
    circle: Circle;
    owner$: Observable<Member>;
    members$: Observable<Member>[];
    votersCount: number;
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

    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    private readonly maxMembersCount = 3;

    public view$: Observable<CircleDetailView>;

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

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter((circle) => circle !== undefined),
            map((circle) => {
                const members$ = this.circleMembers$(circle as Circle);
                const votersCount = this.votersCount(circle as Circle);
                const owner$ = this.owner$(circle as Circle);

                return {
                    circle: circle as Circle,
                    owner$,
                    members$,
                    votersCount,
                    disabled: !this.store.selectSnapshot(CirclesSelectors.canEditCircle())
                };
            })
        );
    }

    private owner$(circle: Circle): Observable<Member> {
        const { createdFrom, voters } = circle;
        const circleOwnerVoter = voters.find(voter => voter.voter === createdFrom);

        if (!circleOwnerVoter) {
            throw Error('createFrom does not exist in circles voters');
        }

        return this.userService.x(createdFrom).pipe(
            map(res => ({
                user: res.data,
                voter: circleOwnerVoter
            } as Member))
        );
    }

    private circleMembers$(circle: Circle): Observable<Member>[] {
        if (!circle.voters.length) {
            return [];
        }

        return circle.voters.slice(0, this.maxMembersCount).map(voter => {
            return this.userService.x(voter.voter).pipe(
                map(res => ({
                    user: res.data,
                    voter
                } as Member))
            );
        });
    }

    private votersCount(circle: Circle): number {
        if (!circle.voters.length) {
            return 0;
        }
        const votersCount = circle.voters.length - this.maxMembersCount;
        return votersCount > 0 ? votersCount : 0;
    }

}
