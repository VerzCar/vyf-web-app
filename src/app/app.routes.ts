import { Routes } from '@angular/router';
import { Route } from './routes';

export const appRoutes: Routes = [
  {
	path: Route.user,
	loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule)
  },
  {
	path: Route.circles,
	loadChildren: () => import('./modules/circles/circles.module').then(m => m.CirclesModule)
  },
  {
	path: Route.default,
	redirectTo: Route.circles,
	pathMatch: 'full'
  }
];
