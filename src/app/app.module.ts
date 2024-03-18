import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeItExtra from '@angular/common/locales/extra/it';
import localeIt from '@angular/common/locales/it';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatNativeDateModule, RippleGlobalOptions } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { ABLY_TOKEN_URL_FACTORY, ActionNotificationModule, AUTH_JWT_TOKEN_FACTORY, ERROR_ACTION_EXECUTOR, SnackbarService } from '@vyf/base';
import { USER_API_URL } from '@vyf/user-service';
import { VOTE_CIRCLE_API_URL } from '@vyf/vote-circle-service';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { environment } from '../env/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './core/auth/auth-interceptor.interceptor';
import { actionErroredFactory } from './core/factory/action-errored.factory';
import { authJwtTokenFactory } from './core/factory/auth-jw-token.factory';
import { langCodeFactory, timezoneFactory } from './core/factory/lang-code.factory';
import { AwsCognitoService } from './core/services/aws-cognito.service';
import { CirclesErrorTrackedActions } from './modules/circles/state/actions/circles.action';
import { RankingErrorTrackedActions } from './modules/ranking/state/actions/ranking.action';
import { UserErrorTrackedActions } from './modules/user/state/actions/user.action';
import { InfoErrorTrackedActions } from './shared/state/actions/info.action';
import { MemberCircleErrorTrackedActions, MemberErrorTrackedActions, MemberRankingErrorTrackedActions } from './shared/state/actions/member.action';

registerLocaleData(localeDe, 'de', localeDeExtra);
registerLocaleData(localeIt, 'it', localeItExtra);

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
        ActionNotificationModule.forRoot({
            errorTrackedActions: [
                ...CirclesErrorTrackedActions,
                ...UserErrorTrackedActions,
                ...RankingErrorTrackedActions,
                ...MemberCircleErrorTrackedActions,
                ...MemberRankingErrorTrackedActions,
                ...MemberErrorTrackedActions,
                ...InfoErrorTrackedActions
            ]
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
        // {
        //     provide: BASE_API_URL,
        //     useValue: ''
        // },
        {
            provide: USER_API_URL,
            useValue: 'https://vyf-user-service-4fe07f1427d1.herokuapp.com'
        },
        {
            provide: VOTE_CIRCLE_API_URL,
            useValue: 'https://vyf-vote-circle-309d72dfd728.herokuapp.com'
        },
        {
            provide: ABLY_TOKEN_URL_FACTORY,
            useValue: 'https://vyf-vote-circle-309d72dfd728.herokuapp.com/v1/api/vote-circle/token/ably'
        },
        {
            provide: MAT_RIPPLE_GLOBAL_OPTIONS,
            useValue: globalRippleConfig
        },
        {
            provide: AUTH_JWT_TOKEN_FACTORY,
            useFactory: authJwtTokenFactory,
            deps: [AwsCognitoService]
        },
        {
            provide: ERROR_ACTION_EXECUTOR,
            useFactory: actionErroredFactory,
            deps: [SnackbarService]
        },
        {
            provide: LOCALE_ID,
            useFactory: langCodeFactory,
            deps: [TranslateService]
        },
        {
            provide: DATE_PIPE_DEFAULT_OPTIONS,
            useFactory: timezoneFactory
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
