import { CandidateRequest, CircleCreateRequest, VoterRequest } from '@vyf/vote-circle-service';
import { CircleCreateRawForm } from '../models';

export const createCircleFormToRequest = (rawForm: CircleCreateRawForm): CircleCreateRequest => ({
    description: rawForm.description ?? undefined,
    name: rawForm.name,
    private: rawForm.private,
    validUntil: rawForm.validUntil ? new Date(rawForm.validUntil) : undefined,
    voters: mapVoters(rawForm.voters),
    candidates: mapCandidates(rawForm.candidates)
});

const mapVoters = (voters: string[]): VoterRequest[] => voters.map(voter => ({
    voter
}));

const mapCandidates = (candidates: string[]): CandidateRequest[] => candidates.map(candidate => ({
    candidate
}));
