import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { AwsCognitoService } from '../../../core/services/aws-cognito.service';
import { Route } from '../../../routes';
import { UserSelectors } from '../../user/state/user.selectors';

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
    private readonly awsService = inject(AwsCognitoService);

    public onMobileMenuClick() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }

    public ngOnInit(): void {
        this.username = this.store.selectSnapshot(UserSelectors.slices.user)?.username ?? '';
    }

    public signOut() {
        this.awsService.signOut();
    }
}
