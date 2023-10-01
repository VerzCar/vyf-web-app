import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { UserRoutingModule } from './user-routing.module';
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
	ReactiveFormsModule,
	RxLet,
	MatMenuModule,
	MatButtonModule,
	MatListModule,
	MatProgressSpinnerModule,
	NgOptimizedImage,
	MatFormFieldModule,
	MatInputModule,
  ],
})
export class UserModule {}
