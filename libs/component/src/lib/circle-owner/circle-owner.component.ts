import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '@vyf/user-service';
import { AvatarImgComponent } from '../avatar-img/avatar-img.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        RouterLink,
        AvatarImgComponent
    ],
    selector: 'vyf-circle-owner',
    standalone: true,
    styleUrls: ['./circle-owner.component.scss'],
    templateUrl: './circle-owner.component.html'
})
export class CircleOwnerComponent {
    @Input({ required: true }) public user!: User;
}
