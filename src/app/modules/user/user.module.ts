import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ToastModule } from 'primeng/toast';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { MenuModule } from 'primeng/menu';

export const createTranslateLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/user/');

@NgModule({
  declarations: [UserProfileComponent],
  imports: [
	CommonModule,
	TranslateModule.forChild({
	  loader: {
		provide: TranslateLoader,
		useFactory: createTranslateLoaderFactory,
		deps: [HttpClient],
	  },
	  isolate: false,
	  extend: true,
	}),
	UserRoutingModule,
	MenuModule,
	ToastModule,
	ButtonModule,
	ImageModule
  ],
})
export class UserModule {}
