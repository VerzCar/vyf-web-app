import { Circle } from '@vyf/vote-circle-service';

export interface CirclesStateModel {
  myCircles: Circle[] | undefined;
  selectedCircle: Circle | undefined;
}
