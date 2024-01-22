import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { RxLet } from '@rx-angular/template/let';
import { AvatarImgComponent } from '@vyf/component';
import { UserState } from '../user/state/user.state';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { ToolbarUserMenuComponent } from './toolbar/toolbar-user-menu/toolbar-user-menu.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent,
    ToolbarUserMenuComponent,
  ],
    imports: [
        CommonModule,
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
        RxLet
    ]
})
export class LayoutModule {}
