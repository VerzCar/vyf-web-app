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
    _translate.currentLang = '';
    const currentLang = _translate.currentLang ?? 'de';
    _translate.use(currentLang);
  }
}
