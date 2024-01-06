import { inject, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout/layout.component';
import { CircleDetailComponent } from './circle-detail/circle-detail.component';
import { CircleNotEligibleComponent } from './circle-not-eligible/circle-not-eligible.component';
import { CirclesOverviewComponent } from './circles-overview/circles-overview.component';
import { CircleDetailGuard } from './services/guard/circle-detail.guard';
import { DetailsResolver } from './services/resolver/details.resolver';
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
                path: ':id',
                component: CircleDetailComponent,
                canActivate: [CircleDetailGuard],
                resolve: {
                    _: (r: ActivatedRouteSnapshot) => inject(DetailsResolver).resolve(r)
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
