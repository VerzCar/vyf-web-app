import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { CircleMemberComponent } from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/user-state/user.state';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingListComponent } from './ranking-list/ranking-list.component';
import { RankingState } from './ranking-state/ranking.state';
import { ListResolver } from './services/resolver/list.resolver';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';

@NgModule({
  declarations: [RankingListComponent, ListItemComponent],
  imports: [
    CommonModule,
    NgxsModule.forFeature([UserState, RankingState]),
    RankingRoutingModule,
    FeatherIconModule,
    NgOptimizedImage,
    CircleMemberComponent,
    RxLet,
  ],
  providers: [ListResolver],
})
export class RankingModule {}
