import { Circle, CirclePaginated } from '@vyf/vote-circle-service';

export interface CirclesStateModel {
    myCircles: Circle[];
    selectedCircle: Circle | undefined;
    circlesOfInterest: CirclePaginated[];
}
