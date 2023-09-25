import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Route } from '../../../routes';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  public currentDate = new Date();

  public readonly routes = [];
}
