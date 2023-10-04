import { createPropertySelectors } from '@ngxs/store';
import { CirclesStateModel } from '../models/circles-state.model';
import { CirclesState } from './circles.state';

export class CirclesSelectors {
    static slices = createPropertySelectors<CirclesStateModel>(CirclesState);
}
