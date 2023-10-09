import { NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { BASE_API_URL, BASE_API_USE_MOCK } from '@vyf/base';
import { environment } from '../env/environment';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AuthInterceptor } from './core/auth/auth-interceptor.interceptor';
import { AwsCognitoService } from './core/services/aws-cognito.service';
import { LayoutModule } from './modules/layout/layout.module';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import awsconfig from '../aws-exports';
import { Amplify } from 'aws-amplify';
import { UserState } from './modules/user/user-state/user.state';

Amplify.configure(awsconfig);

// AoT requires an exported function for factories
export const createTranslateLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/');

const globalRippleConfig: RippleGlobalOptions = {
  disabled: true,
  animation: {
	enterDuration: 0,
	exitDuration: 0
  }
};

@NgModule({
  declarations: [AppComponent],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	HttpClientModule,
	AmplifyAuthenticatorModule,
	NgxsModule.forRoot([], {
	  developmentMode: !environment.production
	}),
	TranslateModule.forRoot(
	  {
		loader: {
		  provide: TranslateLoader,
		  useFactory: createTranslateLoaderFactory,
		  deps: [HttpClient]
		},
		extend: true
	  }
	),
	LayoutModule,
	AppRoutingModule,
  ],
  providers: [
	AwsCognitoService,
	{
	  provide: HTTP_INTERCEPTORS,
	  useClass: AuthInterceptor,
	  multi: true,
	},
	{
	  provide: BASE_API_URL,
	  useValue: ''
	},
	{
	  provide: BASE_API_USE_MOCK,
	  useValue: true
	},
	{
	  provide: MAT_RIPPLE_GLOBAL_OPTIONS,
	  useValue: globalRippleConfig
	}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
