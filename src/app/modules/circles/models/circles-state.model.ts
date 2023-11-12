import { Circle, CirclePaginated, CircleVoter } from '@vyf/vote-circle-service';

export interface CirclesStateModel {
    myCircles: Circle[] | undefined;
    selectedCircle: Circle | undefined;
    selectedCircleVoter: CircleVoter | undefined;
    circlesOfInterest: CirclePaginated[] | undefined;
}
