import { createPropertySelectors } from '@ngxs/store';
import { InfoStateModel } from '../models';
import { InfoState } from './info.state';

export class InfoSelectors {
    public static slices = createPropertySelectors<InfoStateModel>(InfoState);
}
