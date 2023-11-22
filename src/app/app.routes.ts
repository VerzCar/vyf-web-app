import { Routes } from '@angular/router';
import { LayoutComponent } from './modules/layout/layout/layout.component';
import { Vyf404Component } from './modules/vyf/vyf-404/vyf-404.component';
import { Route } from './routes';

export const appRoutes: Routes = [
    {
        path: Route.default,
        loadChildren: () => import('./modules/vyf/vyf.module').then(m => m.VyfModule)
    },
    {
        path: Route.user,
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
    },
    {
        path: Route.circles,
        loadChildren: () => import('./modules/circles/circles.module').then(m => m.CirclesModule)
    },
    {
        path: Route.ranking,
        loadChildren: () => import('./modules/ranking/ranking.module').then(m => m.RankingModule)
    },
    {
        path: '**',
        component: LayoutComponent,
        children: [
            {
                path: '',
                component: Vyf404Component
            }
        ]
    }
];
