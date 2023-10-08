import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Route } from '../../../routes';
import { UserSelectors } from '../../user/user-state/user.selectors';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  public isMobileMenuOpen = false;

  public readonly route = Route;
  public readonly translate = inject(TranslateService);
  public username = '';

  private readonly store = inject(Store);

  public onMobileMenuClick() {
	this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public ngOnInit(): void {
	this.username = this.store.selectSnapshot(UserSelectors.slices.user)?.username ?? '';
  }
}
