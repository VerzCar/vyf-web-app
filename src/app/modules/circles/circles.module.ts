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
import {
    CircleMemberComponent,
    ImageUploadComponent,
    ShortNumberPipe,
    UserAutocompleteComponent
} from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/user-state/user.state';
import { CircleCreateComponent } from './circle-create/circle-create.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleEditComponent } from './circle-edit/circle-edit.component';
import { CircleNotEligibleComponent } from './circle-not-eligible/circle-not-eligible.component';
import { CircleCardComponent } from './circles-overview/circle-card/circle-card.component';
import { CirclesCarouselComponent } from './circles-overview/circles-carousel/circles-carousel.component';
import { CirclesInterestComponent } from './circles-overview/circles-interest/circles-interest.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CirclesRoutingModule } from './circles-routing.module';
import { CirclesState } from './circles-state/circles.state';
import { DetailsResolver } from './services/resolver/details.resolver';
import { EditResolver } from './services/resolver/edit.resolver';
import { OverviewResolver } from './services/resolver/overview.resolver';

@NgModule({
    declarations: [
        CirclesOverviewComponent,
        CircleDetailComponent,
        CircleEditComponent,
        CircleCreateComponent,
        CircleNotEligibleComponent,
        CircleCardComponent,
        CirclesCarouselComponent,
        CirclesInterestComponent
    ],
    imports: [
        CommonModule,
        NgxsModule.forFeature([UserState, CirclesState]),
        MatButtonModule,
        RxLet,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatIconModule,
        RxIf,
        RxFor,
        CirclesRoutingModule,
        FeatherIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        UserAutocompleteComponent,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        ImageUploadComponent,
        ShortNumberPipe,
        CircleMemberComponent
    ],
    providers: [DetailsResolver, EditResolver, OverviewResolver]
})
export class CirclesModule {}
