import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import {
    CircleMemberComponent,
    ImageUploadComponent,
    SubmitButtonComponent, UserAutocompleteSearchComponent,
    UserAutocompleteSelectComponent, UserListItemComponent
} from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from './state/user.state';
import { UserOverviewComponent } from './user-overview/user-overview.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserRoutingModule } from './user-routing.module';
import { UserXComponent } from './user-x/user-x.component';

@NgModule({
    declarations: [
        UserProfileComponent,
        UserProfileEditComponent,
        UserXComponent,
        UserOverviewComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/user/'),
                deps: [HttpClient]
            },
            isolate: false,
            extend: true
        }),
        NgxsModule.forFeature([UserState]),
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
        CircleMemberComponent,
        MatIconModule,
        RxFor,
        ImageUploadComponent,
        FeatherIconModule,
        RxIf,
        RxPush,
        SubmitButtonComponent,
        UserAutocompleteSelectComponent,
        UserAutocompleteSearchComponent,
        UserListItemComponent
    ]
})
export class UserModule {}
