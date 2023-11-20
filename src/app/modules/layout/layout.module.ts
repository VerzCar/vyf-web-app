import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxsModule } from '@ngxs/store';
import { UserState } from '../user/state/user.state';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    NgxsModule.forFeature([UserState]),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/'),
        deps: [HttpClient]
      },
      isolate: false,
      extend: true
    }),
    RouterLink,
    RouterOutlet
  ]
})
export class LayoutModule {}
