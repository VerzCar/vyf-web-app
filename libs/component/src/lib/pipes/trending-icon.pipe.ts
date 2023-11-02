import { Pipe, PipeTransform } from '@angular/core';
import { Placement } from '@vyf/vote-circle-service';

@Pipe({
    name: 'trendingIcon',
    standalone: true
})
export class TrendingIconPipe implements PipeTransform {
    public transform(placement: Placement, ...args: unknown[]): string {
        switch (placement) {
            case Placement.Neutral:
                return 'minus';
            case Placement.Ascending:
                return 'trending-up';
            case Placement.Descending:
                return 'trending-down';
            default:
                return 'minus';
        }
    }
}
