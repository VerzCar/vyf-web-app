import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { CircleCreateComponent } from './circle-create/circle-create.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleEditComponent } from './circle-edit/circle-edit.component';
import { CircleNotEligibleComponent } from './circle-not-eligible/circle-not-eligible.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CircleDetailGuard } from './services/guard/circle-detail.guard';
import { CircleEditGuard } from './services/guard/circle-edit.guard';
import { DetailsResolver } from './services/resolver/details.resolver';
import { EditResolver } from './services/resolver/edit.resolver';
import { OverviewResolver } from './services/resolver/overview.resolver';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: CirclesOverviewComponent,
                resolve: {
                    _: () => inject(OverviewResolver).resolve()
                }
            },
            {
                path: 'not-eligible',
                component: CircleNotEligibleComponent
            },
            {
                path: 'create',
                component: CircleCreateComponent,
                pathMatch: 'full'
            },
            {
                path: ':id',
                component: CircleDetailComponent,
                canActivate: [CircleDetailGuard],
                resolve: {
                    _: (r: ActivatedRouteSnapshot) => inject(DetailsResolver).resolve(r)
                }
            },
            {
                path: ':id/edit',
                component: CircleEditComponent,
                canActivate: [CircleEditGuard],
                resolve: {
                    _: (r: ActivatedRouteSnapshot) => inject(EditResolver).resolve(r)
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CirclesRoutingModule {}
