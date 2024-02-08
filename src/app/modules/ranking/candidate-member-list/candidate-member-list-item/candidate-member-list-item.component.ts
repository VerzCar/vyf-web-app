import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { Circle, Commitment } from '@vyf/vote-circle-service';
import { Observable } from 'rxjs';
import { CandidateMember } from '../../../../shared/models';
import { MemberAction } from '../../../../shared/state/actions/member.action';
import { MemberSelectors } from '../../../../shared/state/member.selectors';

@Component({
    selector: 'app-candidate-member-list-item',
    templateUrl: './candidate-member-list-item.component.html',
    styleUrl: './candidate-member-list-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CandidateMemberListItemComponent {
    @Input({ required: true }) public member!: CandidateMember;
    @Input({ required: true }) public selectedCircle!: Circle;

    public readonly Commitment = Commitment;

    private readonly store = inject(Store);

    public canVote$(id: string): Observable<boolean> {
        return this.store.select(MemberSelectors.RankingSelector.canVote(id));
    }

    public onVote(electedId: string, circleId: number): void {
        this.store.dispatch(new MemberAction.Ranking.Vote(circleId ?? 0, electedId));
    }
}
