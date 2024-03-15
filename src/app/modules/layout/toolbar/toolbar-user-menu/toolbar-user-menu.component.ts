import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { isDefined } from '@vyf/base';
import { AvatarImgSize } from '@vyf/component';
import { User } from '@vyf/user-service';
import { filter, map, Observable, take } from 'rxjs';
import { AwsCognitoService } from '../../../../core/services/aws-cognito.service';
import { Route } from '../../../../routes';
import { UserSelectors } from '../../../user/state/user.selectors';

interface ToolbarUserMenuComponentView {
    user: User;
}

@Component({
    selector: 'app-toolbar-user-menu',
    templateUrl: './toolbar-user-menu.component.html',
    styleUrl: './toolbar-user-menu.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarUserMenuComponent {
    public readonly view$: Observable<ToolbarUserMenuComponentView>;
    public readonly AvatarImgSize = AvatarImgSize;
    public readonly route = Route;

    public readonly translate = inject(TranslateService);
    private readonly store = inject(Store);
    private readonly awsService = inject(AwsCognitoService);

    constructor() {
        this.view$ = this.store.select(UserSelectors.slices.user).pipe(
            filter(user => isDefined(user)),
            map(user => ({
                user: user as User
            }))
        );
    }

    public signOut() {
        this.awsService.signOut().pipe(
            take(1)
        ).subscribe();
    }
}
