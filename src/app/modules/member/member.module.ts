import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxLet } from '@rx-angular/template/let';
import { CircleMemberComponent } from '@vyf/component';
import { UserState } from '../user/user-state/user.state';

import { MemberRoutingModule } from './member-routing.module';
import { MemberListRankingComponent } from './member-list-ranking/member-list-ranking.component';
import { MemberListCircleComponent } from './member-list-circle/member-list-circle.component';
import { MemberState } from './state/member.state';

@NgModule({
    declarations: [
        MemberListRankingComponent,
        MemberListCircleComponent
    ],
  imports: [
    CommonModule,
    MemberRoutingModule,
    NgxsModule.forFeature([UserState, MemberState]),
    CircleMemberComponent,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RxFor,
    RxLet
  ]
})
export class MemberModule {}
