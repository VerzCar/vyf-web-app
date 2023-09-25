import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent {
  constructor(private readonly _translate: TranslateService) {
    const currentLang = _translate.currentLang;
    _translate.currentLang = '';
    _translate.use(currentLang);
  }
}
