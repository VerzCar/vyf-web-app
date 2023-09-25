import { Routes } from '@angular/router';
import { Route } from './routes';

export const appRoutes: Routes = [
    {
        path: Route.user,
        loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
    },
    {
        path: Route.default,
        redirectTo: Route.default,
        pathMatch: 'full'
    }
];
