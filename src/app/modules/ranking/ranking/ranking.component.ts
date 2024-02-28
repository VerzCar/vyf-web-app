import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AvatarImgSize } from '@vyf/component';
import { User, UserService } from '@vyf/user-service';
import { CandidateRequest, VoteCircleService } from '@vyf/vote-circle-service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { Placement } from '../models';

export interface RankingComponentView {
    placement: Placement;
    circleId: number;
}

@Component({
    selector: 'app-ranking',
    templateUrl: './ranking.component.html',
    styleUrl: './ranking.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RankingComponent {
    public readonly view: RankingComponentView;
    public readonly AvatarImgSize = AvatarImgSize;
    public readonly votedByUsers$: Observable<User[]>;

    private readonly bottomSheetRef = inject(MatBottomSheetRef<RankingComponent>);
    private readonly sheetData = inject(MAT_BOTTOM_SHEET_DATA);
    private readonly voteCircleService = inject(VoteCircleService);
    private readonly userService = inject(UserService);

    constructor() {
        this.view = {
            placement: this.sheetData.placement,
            circleId: this.sheetData.circleId
        };

        const candidateReq: CandidateRequest = {
            candidate: this.view.placement.user.identityId
        };

        // TODO: put this in state? when an error occurs nothing will be shown
        this.votedByUsers$ = this.voteCircleService.circleCandidateVotedBy(this.view.circleId, candidateReq).pipe(
            map(res => res.data),
            switchMap(res => forkJoin(this.mapUsers$(res)))
        );
    }

    public onClose() {
        this.bottomSheetRef.dismiss();
    }

    private mapUsers$(userIds: string[]): Observable<User>[] {
        return userIds.map(userId => this.mapUser$(userId));
    }


    private mapUser$(userId: string): Observable<User> {
        return this.userService.x(userId).pipe(
            map(res => res.data)
        );
    }
}
