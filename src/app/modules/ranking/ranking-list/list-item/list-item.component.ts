import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User, UserService } from '@vyf/user-service';
import { Circle, Ranking } from '@vyf/vote-circle-service';
import { map, Observable, shareReplay, startWith, Subject, switchMap, tap } from 'rxjs';
import { RankingAction } from '../../ranking-state/actions/ranking.action';

interface ListItemComponentView {
    user: User;
    ranking: Ranking;
}

@Component({
    selector: 'app-list-item',
    templateUrl: './list-item.component.html',
    styleUrls: ['./list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent implements OnInit {
    @Input({ required: true }) public circle!: Circle;

    @Input({ required: true })
    public set ranking(ranking: Ranking) {
        this._ranking = ranking;
        this.rankingSubject.next(ranking);
    }

    public view$: Observable<ListItemComponentView> | undefined;

    private _ranking!: Ranking;

    private readonly rankingSubject = new Subject<Ranking>();
    private readonly userService = inject(UserService);
    private readonly store = inject(Store);
    private readonly ranking$: Observable<Ranking>;

    constructor() {
        this.ranking$ = this.rankingSubject.asObservable();
    }

    public ngOnInit(): void {
        this.view$ = this.ranking$.pipe(
            startWith(this._ranking),
            tap(r => console.log(r)),
            switchMap(ranking =>
                this.userService.x(ranking.identityId)
            ),
            map(res => res.data),
            map(user => ({
                user: user as User,
                ranking: this._ranking
            })),
            shareReplay()
        );
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new RankingAction.Vote(circleId, electedIdentId));
    }

}
