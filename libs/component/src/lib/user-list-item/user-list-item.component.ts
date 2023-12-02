import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RxIf } from '@rx-angular/template/if';
import { UserPaginated } from '@vyf/user-service';
import { AvatarImgComponent, AvatarImgSize } from '../avatar-img/avatar-img.component';
import { FeatherIconModule } from '../feather-icon/feather-icon.module';
import { ShortNamePipe } from '../pipes/short-name.pipe';

@Component({
    selector: 'vyf-user-list-item',
    standalone: true,
    imports: [CommonModule, FeatherIconModule, RxIf, ShortNamePipe, NgOptimizedImage, AvatarImgComponent],
    templateUrl: './user-list-item.component.html',
    styleUrls: ['./user-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListItemComponent {
    @Input({ required: true }) public user!: UserPaginated;
    protected readonly AvatarImgSize = AvatarImgSize;
}
