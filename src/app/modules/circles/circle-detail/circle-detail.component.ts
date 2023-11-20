import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { CircleMemberComponentOption } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { Circle, CircleVoter, Voter } from '@vyf/vote-circle-service';
import { combineLatest, filter, map, Observable } from 'rxjs';
import { CirclesSelectors } from '../state/circles.selectors';

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
        this.view$ = combineLatest([
            this.store.select(CirclesSelectors.slices.selectedCircle),
            this.store.select(CirclesSelectors.slices.selectedCircleVoter)
        ]).pipe(
            filter(([circle, circleVoter]) => isDefined(circle) && isDefined(circleVoter)),
            map(([c, circleVoter]) => {
                const voters = (circleVoter as CircleVoter).voters;
                const circle = c as Circle;
                const members$ = this.circleMembers$(voters);
                const votersCount = this.votersCount(voters);
                const owner$ = this.owner$(circle.createdFrom, voters);

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

    private owner$(createdFrom: string, voters: Voter[]): Observable<Member> {
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

    private circleMembers$(voters: Voter[]): Observable<Member>[] {
        if (!voters.length) {
            return [];
        }

        return voters.slice(0, this.maxMembersCount).map(voter => {
            return this.userService.x(voter.voter).pipe(
                map(res => ({
                    user: res.data,
                    voter
                } as Member))
            );
        });
    }

    private votersCount(voters: Voter[]): number {
        if (!voters.length) {
            return 0;
        }
        const votersCount = voters.length - this.maxMembersCount;
        return votersCount > 0 ? votersCount : 0;
    }

}
