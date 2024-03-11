import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import {
    AvatarStackComponent,
    CircleAutocompleteSearchComponent,
    CircleOwnerComponent,
    ImageUploadComponent,
    ShortNumberPipe, SkeletonAvatarStackComponent, SkeletonListComponent,
    UserAutocompleteSelectComponent, ValidityPeriodComponent
} from '@vyf/component';
import { InfoState } from '../../shared/state/info.state';
import { MemberState } from '../../shared/state/member.state';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { CircleDetailActionBarComponent } from './circle-detail-action-bar/circle-detail-action-bar.component';
import { CircleDetailActionItemJoinComponent } from './circle-detail-action-bar/circle-detail-action-item-join/circle-detail-action-item-join.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleNotEligibleComponent } from './circle-not-eligible/circle-not-eligible.component';
import { CircleCardComponent } from './circles-overview/circle-card/circle-card.component';
import { CirclesCarouselComponent } from './circles-overview/circles-carousel/circles-carousel.component';
import { CirclesInterestComponent } from './circles-overview/circles-interest/circles-interest.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CirclesRoutingModule } from './circles-routing.module';
import { DetailsResolver } from './services/resolver/details.resolver';
import { OverviewResolver } from './services/resolver/overview.resolver';
import { CirclesState } from './state/circles.state';
import { CircleDetailActionItemCommitmentComponent } from './circle-detail-action-bar/circle-detail-action-item-commitment/circle-detail-action-item-commitment.component';
import { CircleDetailActionItemLeaveVoterComponent } from './circle-detail-action-bar/circle-detail-action-item-leave-voter/circle-detail-action-item-leave-voter.component';
import { CircleDetailMembersComponent } from './circle-detail-members/circle-detail-members.component';

@NgModule({
  declarations: [
    CirclesOverviewComponent,
    CircleDetailComponent,
    CircleNotEligibleComponent,
    CircleCardComponent,
    CirclesCarouselComponent,
    CirclesInterestComponent,
    CircleDetailActionBarComponent,
    CircleDetailActionItemJoinComponent,
    CircleDetailActionItemCommitmentComponent,
    CircleDetailActionItemLeaveVoterComponent,
    CircleDetailMembersComponent,
  ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([UserState, CirclesState, MemberState, InfoState]),
        MatButtonModule,
        RxLet,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatIconModule,
        RxIf,
        RxFor,
        RxPush,
        CirclesRoutingModule,
        FeatherIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        UserAutocompleteSelectComponent,
        CircleAutocompleteSearchComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        ImageUploadComponent,
        ShortNumberPipe,
        CircleOwnerComponent,
        AvatarStackComponent,
        SkeletonListComponent,
        SkeletonAvatarStackComponent,
        ValidityPeriodComponent
    ],
  providers: [DetailsResolver, OverviewResolver],
})
export class CirclesModule {}
