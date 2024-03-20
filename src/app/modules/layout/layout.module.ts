import { DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { RxPush } from '@rx-angular/template/push';
import { AvatarImgComponent } from '@vyf/component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { UserState } from '../user/state/user.state';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarCircleInvitationsComponent } from './toolbar/toolbar-circle-invitations/toolbar-circle-invitations.component';
import { ToolbarUserMenuComponent } from './toolbar/toolbar-user-menu/toolbar-user-menu.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
    declarations: [
        LayoutComponent,
        ToolbarComponent,
        FooterComponent,
        ToolbarUserMenuComponent,
        ToolbarCircleInvitationsComponent
    ],
    imports: [
        NgxsModule.forFeature([UserState]),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) =>
                    new TranslateHttpLoader(http, './assets/i18n/core/'),
                deps: [HttpClient]
            },
            isolate: false,
            extend: true
        }),
        RouterLink,
        RouterOutlet,
        MatMenuModule,
        AvatarImgComponent,
        RxLet,
        RxPush,
        MatButtonModule,
        FeatherIconModule,
        MatBadgeModule,
        NgClass,
        TitleCasePipe,
        DatePipe
    ]
})
export class LayoutModule {}
