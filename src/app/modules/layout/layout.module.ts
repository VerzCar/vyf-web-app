import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { FooterComponent } from './footer/footer.component';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export const createTranslateLoaderFactory = (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/core/');

@NgModule({
  declarations: [
    LayoutComponent,
    ToolbarComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: { provide: TranslateLoader, useFactory: createTranslateLoaderFactory, deps: [HttpClient] },
      isolate: false,
      extend: true
    }),
    RouterLink,
    RouterOutlet
  ]
})
export class LayoutModule {}
