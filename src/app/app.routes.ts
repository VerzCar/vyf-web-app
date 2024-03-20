import { Routes } from '@angular/router';
import { Route } from './routes';

export const appRoutes: Routes = [
    {
        path: Route.user,
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    },
    {
        path: Route.circles,
        loadChildren: () => import('./modules/circles/circles.module').then(m => m.CirclesModule),
    },
    {
        path: Route.ranking,
        loadChildren: () => import('./modules/ranking/ranking.module').then(m => m.RankingModule),
    },
    {
        path: '**',
        loadChildren: () => import('./modules/four-zero-four/four-zero-four.module').then(m => m.FourZeroFourModule)
    }
];
