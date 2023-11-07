import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { CirclePaginated } from '@vyf/vote-circle-service';
import { filter, map, Observable } from 'rxjs';
import { CirclesSelectors } from '../../circles-state/circles.selectors';

interface CirclesInterestView {
  circles: CirclePaginated[];
}

@Component({
  selector: 'app-circles-interest',
  templateUrl: './circles-interest.component.html',
  styleUrls: ['./circles-interest.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclesInterestComponent {
  private readonly store = inject(Store);

  public view$: Observable<CirclesInterestView>;

  constructor() {
    this.view$ = this.store.select(CirclesSelectors.slices.circlesOfInterest).pipe(
        filter((circles) => circles !== undefined),
        map(circles => ({
          circles: circles as CirclePaginated[]
        }))
    );
  }
}
