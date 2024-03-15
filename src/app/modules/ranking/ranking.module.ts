import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { AvatarImgComponent, AvatarStackComponent, BadgeComponent, CircleAutocompleteSearchComponent, CircleAutocompleteSelectComponent, CircleOwnerComponent, CircleStagePipe, ShortNamePipe, ShortNumberPipe, SkeletonAvatarComponent, SkeletonAvatarListComponent, SkeletonAvatarStackComponent, SkeletonListComponent, TrendingIconPipe, UserListItemComponent, ValidityPeriodComponent } from '@vyf/component';
import { InfoState } from '../../shared/state/info.state';
import { MemberState } from '../../shared/state/member.state';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { CandidateMemberListDialogComponent } from './candidate-member-list-dialog/candidate-member-list-dialog.component';
import { CandidateMemberListItemComponent } from './candidate-member-list/candidate-member-list-item/candidate-member-list-item.component';
import { CandidateMemberListComponent } from './candidate-member-list/candidate-member-list.component';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';
import { MembersNeedVoteComponent } from './ranking-list/members-need-vote/members-need-vote.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { RankingSelectComponent } from './ranking-list/ranking-select/ranking-select.component';
import { TopRankedComponent } from './ranking-list/top-three/top-ranked/top-ranked.component';
import { TopThreeComponent } from './ranking-list/top-three/top-three.component';
import { ValidPeriodComponent } from './ranking-list/valid-until/valid-period.component';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './ranking/ranking.component';
import { ListResolver } from './services/resolver/list.resolver';
import { RankingState } from './state/ranking.state';

@NgModule({
    declarations: [
        RankingListComponent,
        ListItemComponent,
        TopThreeComponent,
        TopRankedComponent,
        CandidateMemberListComponent,
        CandidateMemberListItemComponent,
        CandidateMemberListDialogComponent,
        RankingComponent,
        MembersNeedVoteComponent,
        RankingSelectComponent,
        ValidPeriodComponent
    ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([UserState, RankingState, MemberState, InfoState]),
        RankingRoutingModule,
        FeatherIconModule,
        NgOptimizedImage,
        CircleOwnerComponent,
        RxLet,
        MatButtonModule,
        MatBottomSheetModule,
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
        SkeletonListComponent,
        SkeletonAvatarStackComponent,
        SkeletonAvatarComponent,
        SkeletonAvatarListComponent,
        CircleAutocompleteSearchComponent,
        CircleAutocompleteSelectComponent,
        RxPush,
        BadgeComponent,
        CircleStagePipe,
        ValidityPeriodComponent
    ],
    providers: [ListResolver]
})
export class RankingModule {}
