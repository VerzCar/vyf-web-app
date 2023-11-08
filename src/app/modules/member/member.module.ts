import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxLet } from '@rx-angular/template/let';
import { MemberListItemComponent } from '@vyf/component';
import { RankingState } from '../ranking/ranking-state/ranking.state';
import { UserState } from '../user/user-state/user.state';
import { MemberListCircleComponent } from './member-list-circle/member-list-circle.component';
import { MemberListRankingComponent } from './member-list-ranking/member-list-ranking.component';

import { MemberRoutingModule } from './member-routing.module';
import { MemberState } from './state/member.state';

@NgModule({
    declarations: [
        MemberListRankingComponent,
        MemberListCircleComponent
    ],
    imports: [
        CommonModule,
        MemberRoutingModule,
        NgxsModule.forFeature([UserState, MemberState, RankingState]),
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RxFor,
        RxLet,
        MemberListItemComponent
    ]
})
export class MemberModule {}
