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
  AvatarStackComponent,
  CircleMemberComponent,
  MemberListItemComponent,
  ShortNamePipe,
  ShortNumberPipe,
  TrendingIconPipe,
  UserListItemComponent,
} from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { MemberListRankingComponent } from './member-list-ranking/member-list-ranking.component';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { TopRankedComponent } from './ranking-list/top-three/top-ranked/top-ranked.component';
import { TopThreeComponent } from './ranking-list/top-three/top-three.component';

import { RankingRoutingModule } from './ranking-routing.module';
import { ListResolver } from './services/resolver/list.resolver';
import { MemberState } from './state/member.state';
import { RankingState } from './state/ranking.state';
import { MemberListRankingDialogComponent } from './member-list-ranking-dialog/member-list-ranking-dialog.component';

@NgModule({
  declarations: [
    RankingListComponent,
    ListItemComponent,
    TopThreeComponent,
    TopRankedComponent,
    MemberListRankingComponent,
    MemberListRankingDialogComponent,
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([UserState, RankingState, MemberState]),
    RankingRoutingModule,
    FeatherIconModule,
    NgOptimizedImage,
    CircleMemberComponent,
    RxLet,
    MatButtonModule,
    RxFor,
    UserListItemComponent,
    RxIf,
    ShortNamePipe,
    TrendingIconPipe,
    ShortNumberPipe,
    AvatarStackComponent,
    MemberListItemComponent,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [ListResolver],
})
export class RankingModule {}
