import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
import { MenuModule } from 'primeng/menu';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserState } from './user-state/user.state';

export const createTranslateLoaderFactory = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/user/');

@NgModule({
  declarations: [
	UserProfileComponent,
	UserProfileEditComponent
  ],
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
	NgxsModule.forFeature([
	  UserState
	]),
	UserRoutingModule,
	MenuModule,
	ToastModule,
	ButtonModule,
	ImageModule,
	InputTextareaModule,
	ReactiveFormsModule,
	RxLet,
	ProgressSpinnerModule,
  ],
})
export class UserModule {}
