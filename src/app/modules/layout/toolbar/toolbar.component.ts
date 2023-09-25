import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Route } from '../../../routes';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  public isMobileMenuOpen = false;

  public readonly route = Route;

  constructor(public translate: TranslateService) {
  }

  public onMobileMenuClick() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
