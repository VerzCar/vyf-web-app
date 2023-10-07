import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-circles-overview',
  templateUrl: './circles-overview.component.html',
  styleUrls: ['./circles-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclesOverviewComponent {
  circles: string[] | undefined = [''];
}
