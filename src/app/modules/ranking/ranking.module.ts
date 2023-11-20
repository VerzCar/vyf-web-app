import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import {
  CircleMemberComponent,
  ShortNamePipe,
  ShortNumberPipe,
  TrendingIconPipe,
  UserListItemComponent
} from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
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
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([UserState, RankingState]),
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
    ShortNumberPipe
  ],
  providers: [ListResolver],
})
export class RankingModule {}
