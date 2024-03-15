import { User } from '@vyf/user-service';
import { Circle, CirclePaginated, UserOption } from '@vyf/vote-circle-service';

export interface CirclesStateModel {
    myCircles: Circle[];
    selectedCircle: Circle | undefined;
    selectedCircleOwner: User | undefined;
    circlesOfInterest: CirclePaginated[];
    option: UserOption;
}
