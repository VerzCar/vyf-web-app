import { Pipe, PipeTransform } from '@angular/core';
import { CircleStage } from '@vyf/vote-circle-service';

@Pipe({
    name: 'circleStage',
    standalone: true
})
export class CircleStagePipe implements PipeTransform {
    /**
     * checks again the given match stages if the current stage is one of the matching.
     * @param {CircleStage} stage
     * @param {CircleStage} matchStage
     * @returns {boolean} true if match one of given stages, otherwise false.
     */
    public transform(stage: CircleStage, ...matchStage: CircleStage[]): boolean {
        return matchStage.some(matchStage => stage === matchStage);
    }
}
