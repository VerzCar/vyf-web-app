import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { CircleMemberComponent, ShortNamePipe, TrendingIconPipe, UserListItemComponent } from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/user-state/user.state';
import { ListItemComponent } from './ranking-list/list-item/list-item.component';
import { RankingListComponent } from './ranking-list/ranking-list.component';

import { RankingRoutingModule } from './ranking-routing.module';
import { RankingState } from './ranking-state/ranking.state';
import { ListResolver } from './services/resolver/list.resolver';

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
        MatButtonModule,
        RxFor,
        UserListItemComponent,
        RxIf,
        ShortNamePipe,
        TrendingIconPipe
    ],
    providers: [ListResolver]
})
export class RankingModule {}
