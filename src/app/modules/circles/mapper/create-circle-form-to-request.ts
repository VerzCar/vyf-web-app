import { CircleCreateRequest, VoterRequest } from '@vyf/vote-circle-service';
import { CircleCreateRawForm } from '../models';

export const createCircleFormToRequest = (rawForm: CircleCreateRawForm): CircleCreateRequest => ({
    description: rawForm.description ?? undefined,
    imageSrc: rawForm.imgSrc ?? undefined,
    name: rawForm.name,
    private: rawForm.private,
    validUntil: rawForm.validUntil ? new Date(rawForm.validUntil) : undefined,
    voters: mapVoters(rawForm.voters)
});

const mapVoters = (voters: string[]): VoterRequest[] => voters.map(voter => ({
    voter
}));
