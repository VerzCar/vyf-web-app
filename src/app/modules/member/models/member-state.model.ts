import { Circle } from '@vyf/vote-circle-service';
import { Member } from './member.model';

export interface MemberStateModel {
    selectedCircle: Circle | undefined;
    members: Member[] | undefined;
}
