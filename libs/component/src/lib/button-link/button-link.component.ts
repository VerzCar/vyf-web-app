import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vyf-button-link',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './button-link.component.html',
  styleUrls: ['./button-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonLinkComponent {
  @Input() public readonly href: string | null = null;
  @Input() public readonly routerLink: string | string[] | null = null;
  @Input() public readonly componentClass: string | string[] | Set<string> | {[p: string]: any} | null | undefined = null;
}
