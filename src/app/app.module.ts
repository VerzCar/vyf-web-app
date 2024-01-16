import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatNativeDateModule, RippleGlobalOptions } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { AUTH_JWT_TOKEN_FACTORY, BASE_API_URL } from '@vyf/base';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { environment } from '../env/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/auth/auth-interceptor.interceptor';
import { authJwtTokenFactory } from './core/auth/helper';
import { AwsCognitoService } from './core/services/aws-cognito.service';
import { LayoutModule } from './modules/layout/layout.module';

Amplify.configure(awsconfig);

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
                    useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/'),
                    deps: [HttpClient]
                },
                extend: true
            }
        ),
        LayoutModule,
        AppRoutingModule,
        MatNativeDateModule
    ],
    providers: [
        AwsCognitoService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: BASE_API_URL,
            useValue: ''
        },
        {
            provide: MAT_RIPPLE_GLOBAL_OPTIONS,
            useValue: globalRippleConfig
        },
        {
            provide: AUTH_JWT_TOKEN_FACTORY,
            useFactory: authJwtTokenFactory,
            deps: [AwsCognitoService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
