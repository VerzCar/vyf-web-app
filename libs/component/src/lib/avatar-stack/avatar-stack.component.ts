import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RxFor } from '@rx-angular/template/for';
import { RxIf } from '@rx-angular/template/if';
import { ShortNamePipe } from '@vyf/component';
import { User } from '@vyf/user-service';

@Component({
  selector: 'vyf-avatar-stack',
  standalone: true,
  imports: [
    RouterLink,
    RxIf,
    ShortNamePipe,
    RxFor,
    NgOptimizedImage
  ],
  templateUrl: 'avatar-stack.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarStackComponent {
  @Input({required: true}) users!: User[];
  @Input() routerLink: any[] = [];
  @Input() plusCount: number = 0;
}
