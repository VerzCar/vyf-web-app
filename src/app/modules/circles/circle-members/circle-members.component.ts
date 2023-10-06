import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { User, UserService } from '@vyf/user-service';
import { Circle, Voter } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { CirclesSelectors } from '../circles-state/circles.selectors';

interface Member {
    user: User;
    voter: Voter;
}

interface CircleMembersView {
    circle: Circle;
    members$: Observable<Member>[];
}

@Component({
    selector: 'app-circle-members',
    templateUrl: './circle-members.component.html',
    styleUrls: ['./circle-members.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircleMembersComponent {
    private readonly store = inject(Store);
    private readonly userService = inject(UserService);

    public view$: Observable<CircleMembersView>;

    constructor() {
        this.view$ = this.store.select(CirclesSelectors.slices.selectedCircle).pipe(
            filter((circle) => circle !== undefined),
            map((circle) => {
                const members$ = circle!.voters.map(voter => {
                    return this.userService.x(voter.voter).pipe(
                        map(res => ({
                            user: res.data,
                            voter
                        } as Member))
                    );
                });

                return {
                    circle: circle!,
                    members$
                };
            })
        );
    }
}
