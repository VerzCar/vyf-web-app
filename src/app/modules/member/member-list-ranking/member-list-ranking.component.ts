import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { User, UserService } from '@vyf/user-service';
import { Circle, Voter } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { MemberSelectors } from '../state/member.selectors';

interface Member {
    user: User;
    voter: Voter;
}

interface MemberListRankingView {
    circle: Circle;
    members$: Observable<Member>[];
}

@Component({
    selector: 'app-member-list-ranking',
    templateUrl: './member-list-ranking.component.html',
    styleUrls: ['./member-list-ranking.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberListRankingComponent {
    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    public view$: Observable<MemberListRankingView>;

    constructor() {
        this.view$ = this.store.select(MemberSelectors.slices.selectedCircle).pipe(
            filter((circle) => circle !== undefined),
            map((circle) => {
                const members$ = this.members$(circle as Circle);
                return {
                    circle: circle as Circle,
                    members$
                };
            })
        );
    }

    private members$(circle: Circle): Observable<Member>[] {
        return circle.voters.map(voter => {
            return this.userService.x(voter.voter).pipe(
                map(res => ({
                    user: res.data,
                    voter
                } as Member))
            );
        });
    }

}
