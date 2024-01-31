import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import {
    AvatarImgComponent,
    AvatarStackComponent,
    CircleOwnerComponent,
    ShortNamePipe,
    ShortNumberPipe,
    TrendingIconPipe,
    UserListItemComponent
} from '@vyf/component';
import { CircleMemberCommitmentPipe } from '../../../../libs/component/src/lib/pipes/circle-member-commitment.pipe';
import { MemberState } from '../../shared/state/member.state';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { CandidateMemberListDialogComponent } from './candidate-member-list-dialog/candidate-member-list-dialog.component';
import { CandidateMemberListComponent } from './candidate-member-list/candidate-member-list.component';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { TopRankedComponent } from './ranking-list/top-three/top-ranked/top-ranked.component';
import { TopThreeComponent } from './ranking-list/top-three/top-three.component';

import { RankingRoutingModule } from './ranking-routing.module';
import { ListResolver } from './services/resolver/list.resolver';
import { RankingState } from './state/ranking.state';

@NgModule({
    declarations: [
        RankingListComponent,
        ListItemComponent,
        TopThreeComponent,
        TopRankedComponent,
        CandidateMemberListComponent,
        CandidateMemberListDialogComponent
    ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([UserState, RankingState, MemberState]),
        RankingRoutingModule,
        FeatherIconModule,
        NgOptimizedImage,
        CircleOwnerComponent,
        RxLet,
        MatButtonModule,
        RxFor,
        UserListItemComponent,
        RxIf,
        ShortNamePipe,
        TrendingIconPipe,
        ShortNumberPipe,
        AvatarStackComponent,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatIconModule,
        AvatarImgComponent,
        CircleMemberCommitmentPipe
    ],
    providers: [ListResolver]
})
export class RankingModule {}
