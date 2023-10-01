import { NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, RippleGlobalOptions } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { BASE_API_URL } from '@vyf/user-service';
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
	AppRoutingModule,
	LayoutModule,
	NgxsModule.forRoot([], {
	  developmentMode: !environment.production
	})
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
	  provide: MAT_RIPPLE_GLOBAL_OPTIONS,
	  useValue: globalRippleConfig
	}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
