import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { CirclesRoutingModule } from './circles-routing.module';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleEditComponent } from './circle-edit/circle-edit.component';
import { CircleCreateComponent } from './circle-create/circle-create.component';
import { CircleMembersComponent } from './circle-members/circle-members.component';
import { CirclesState } from './circles-state/circles.state';
import { DetailsResolver } from './services/details.resolver';
import { EditResolver } from './services/edit.resolver';

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
        CirclesRoutingModule,
        NgxsModule.forFeature([
            CirclesState
        ]),
        MatButtonModule,
        RxLet,
        MatProgressSpinnerModule,
        NgOptimizedImage,
        MatIconModule,
        RxIf
    ],
    providers: [
        DetailsResolver,
        EditResolver
    ]
})
export class CirclesModule {}
