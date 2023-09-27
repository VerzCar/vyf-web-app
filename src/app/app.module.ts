import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BASE_API_URL } from '@vyf/user-service';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from './modules/layout/layout.module';

// AoT requires an exported function for factories
export const createTranslateLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/');

@NgModule({
  declarations: [AppComponent],
  imports: [
	BrowserModule,
	BrowserAnimationsModule,
	HttpClientModule,
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
	LayoutModule
  ],
  providers: [
	{
	  provide: BASE_API_URL,
	  useValue: ''
	}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
