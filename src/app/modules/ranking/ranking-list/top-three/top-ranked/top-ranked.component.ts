import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { User, UserService } from '@vyf/user-service';
import { Circle, Ranking } from '@vyf/vote-circle-service';
import { map, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { RankingAction } from '../../../ranking-state/actions/ranking.action';
import { RankingSelectors } from '../../../ranking-state/ranking.selectors';

export enum TopThreePlacement {
  First,
  Second,
  Third
}

interface TopRankedComponentView {
  user: User;
  ranking: Ranking;
}

@Component({
  selector: 'app-top-ranked',
  templateUrl: './top-ranked.component.html',
  styleUrls: ['./top-ranked.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRankedComponent implements OnInit {
  @Input({ required: true }) public circle!: Circle;
  @Input({required: true}) public topPlacement!: TopThreePlacement;

  @Input({ required: true })
  public set ranking(ranking: Ranking) {
    this._ranking = ranking;
    this.rankingSubject.next(ranking);
  }

  public readonly TopThreePlacement = TopThreePlacement;
  public readonly canVote$: Observable<boolean>;

  public view$: Observable<TopRankedComponentView> | undefined;

  private _ranking!: Ranking;

  private readonly rankingSubject = new Subject<Ranking>();
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);
  private readonly ranking$: Observable<Ranking>;

  constructor() {
    this.ranking$ = this.rankingSubject.asObservable();
    this.canVote$ = this.store.select(RankingSelectors.canVote);
  }

  public ngOnInit(): void {
    this.view$ = this.ranking$.pipe(
        startWith(this._ranking),
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
