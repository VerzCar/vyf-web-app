import { DATE_PIPE_DEFAULT_OPTIONS, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import localeItExtra from '@angular/common/locales/extra/it';
import localeIt from '@angular/common/locales/it';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
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
import { ablyTokenEndpointUrlFactory, userBaseApiUrlFactory, voteCircleBaseApiUrlFactory } from './core/factory/base-url.factory';
import { initializeAppFactory } from './core/factory/init-app.factory';
import { langCodeFactory, timezoneFactory } from './core/factory/lang-code.factory';
import { AwsCognitoService } from './core/services/aws-cognito.service';
import { UserStorageService } from './core/services/user-storage.service';
import { CirclesErrorTrackedActions } from './modules/circles/state/actions/circles.action';
import { RankingErrorTrackedActions } from './modules/ranking/state/actions/ranking.action';
import { InfoErrorTrackedActions } from './shared/state/actions/info.action';
import { MemberCircleErrorTrackedActions, MemberErrorTrackedActions, MemberRankingErrorTrackedActions } from './shared/state/actions/member.action';
import { UserErrorTrackedActions } from './shared/state/actions/user.action';

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
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
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
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/'),
                deps: [HttpClient]
            },
            extend: true
        }),
        AmplifyAuthenticatorModule,
        AppRoutingModule,
        MatNativeDateModule], providers: [
        UserStorageService,
        AwsCognitoService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: APP_INITIALIZER,
            useFactory: initializeAppFactory,
            multi: true,
            deps: [AwsCognitoService, UserStorageService]
        },
        // {
        //     provide: BASE_API_URL,
        //     useValue: ''
        // },
        {
            provide: USER_API_URL,
            useFactory: userBaseApiUrlFactory
        },
        {
            provide: VOTE_CIRCLE_API_URL,
            useFactory: voteCircleBaseApiUrlFactory
        },
        {
            provide: ABLY_TOKEN_URL_FACTORY,
            useFactory: ablyTokenEndpointUrlFactory
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
        },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule {}
