import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { CircleMemberComponent } from '@vyf/component';
import { UserState } from '../user/user-state/user.state';
import { CirclesRoutingModule } from './circles-routing.module';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleEditComponent } from './circle-edit/circle-edit.component';
import { CircleCreateComponent } from './circle-create/circle-create.component';
import { CircleMembersComponent } from './circle-members/circle-members.component';
import { CirclesState } from './circles-state/circles.state';
import { DetailsResolver } from './services/details.resolver';
import { EditResolver } from './services/edit.resolver';
import { CircleMemberCommitmentPipe } from '../../../../libs/component/src/lib/pipes/circle-member-commitment.pipe';

@NgModule({
    declarations: [
        CirclesOverviewComponent,
        CircleDetailComponent,
        CircleEditComponent,
        CircleCreateComponent,
        CircleMembersComponent
    ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([
            UserState,
            CirclesState
        ]),
        CirclesRoutingModule,
        MatButtonModule,
        RxLet,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatIconModule,
        RxIf,
        RxFor,
        CircleMemberComponent
    ],
    providers: [
        DetailsResolver,
        EditResolver
    ]
})
export class CirclesModule {}
