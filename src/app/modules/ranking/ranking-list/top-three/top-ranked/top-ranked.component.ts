import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { Placement } from '../../../models';
import { MemberAction } from '../../../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../../../shared/state/member.selectors';

export enum TopThreePlacement {
    First,
    Second,
    Third
}

@Component({
    selector: 'app-top-ranked',
    templateUrl: './top-ranked.component.html',
    styleUrls: ['./top-ranked.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopRankedComponent implements OnInit {
    @Input({ required: true }) public circle!: Circle;
    @Input({ required: true }) public placement!: Placement;
    @Input({ required: true }) public topPlacement!: TopThreePlacement;

    public readonly TopThreePlacement = TopThreePlacement;
    public canVote$: Observable<boolean> | undefined;

    private readonly store = inject(Store);

    public ngOnInit(): void {
        this.canVote$ = this.store.select(MemberSelectors.RankingSelector.canVote(this.placement.user.identityId));
    }

    public onVote(circleId: number, electedIdentId: string) {
        this.store.dispatch(new MemberAction.Vote(circleId, electedIdentId));
    }
}
