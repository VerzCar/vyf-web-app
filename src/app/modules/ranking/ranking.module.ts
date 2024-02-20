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
import {
  AvatarImgComponent,
  AvatarStackComponent,
  CircleOwnerComponent,
  ShortNamePipe,
  ShortNumberPipe, SkeletonListComponent,
  TrendingIconPipe,
  UserListItemComponent
} from '@vyf/component';
import { MemberState } from '../../shared/state/member.state';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { CandidateMemberListDialogComponent } from './candidate-member-list-dialog/candidate-member-list-dialog.component';
import { CandidateMemberListItemComponent } from './candidate-member-list/candidate-member-list-item/candidate-member-list-item.component';
import { CandidateMemberListComponent } from './candidate-member-list/candidate-member-list.component';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { TopRankedComponent } from './ranking-list/top-three/top-ranked/top-ranked.component';
import { TopThreeComponent } from './ranking-list/top-three/top-three.component';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingComponent } from './ranking/ranking.component';
import { ListResolver } from './services/resolver/list.resolver';
import { RankingState } from './state/ranking.state';
import { MembersNeedVoteComponent } from './ranking-list/members-need-vote/members-need-vote.component';
import { RankingSelectComponent } from './ranking-list/ranking-select/ranking-select.component';
import { ValidUntilComponent } from './ranking-list/valid-until/valid-until.component';

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
    ValidUntilComponent,
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
    SkeletonListComponent
  ],
  providers: [ListResolver],
})
export class RankingModule {}
