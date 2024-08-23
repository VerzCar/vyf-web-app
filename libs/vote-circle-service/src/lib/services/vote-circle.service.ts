import { HttpParams } from '@angular/common/http';
import { inject, Injectable, InjectionToken } from '@angular/core';
import { ApiBaseService, ApiResponse } from '@vyf/base';
import { Observable } from 'rxjs';
import { Candidate, CandidateRequest, Circle, CircleCandidate, CircleCandidateCommitmentRequest, CircleCandidatesFilter, CircleCreateRequest, CirclePaginated, CircleUpdateRequest, CircleVoter, CircleVotersFilter, Commitment, Ranking, UserOption, VoteCreateRequest, Voter, VoterRequest } from '../models';

export const VOTE_CIRCLE_API_URL = new InjectionToken<string>('Vote circle API Url', {
    providedIn: 'any',
    factory: () => window.location.origin
});

@Injectable({
    providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService {
    private readonly _baseUrl = inject(VOTE_CIRCLE_API_URL);

    protected get baseUrl(): string {
        return this._baseUrl;
    }

    protected get endpointPath(): string {
        return 'v1/api/vote-circle';
    }

    public circle(id: number): Observable<ApiResponse<Circle>> {
        return this.get({ paths: ['circle', id] });
    }

    public circles(): Observable<ApiResponse<Circle[]>> {
        return this.getAll({ paths: ['circles'] });
    }

    public circlesFiltered(name: string): Observable<ApiResponse<CirclePaginated[]>> {
        return this.getAll({ paths: ['circles', name] });
    }

    public circlesOfInterest(): Observable<ApiResponse<CirclePaginated[]>> {
        return this.getAll({ paths: ['circles', 'of-interest'] });
    }

    public circlesOpenCommitments(): Observable<ApiResponse<CirclePaginated[]>> {
        return this.getAll({ paths: ['circles', 'open-commitments'] });
    }

    public createCircle(circle: CircleCreateRequest): Observable<ApiResponse<Circle>> {
        return this.create(circle, 'circle');
    }

    public updateCircle(circleId: number, circle: Partial<CircleUpdateRequest>): Observable<ApiResponse<Circle>> {
        return this.update(circle, `circle/${circleId}`);
    }

    public deleteCircle(circleId: number): Observable<ApiResponse<string>> {
        return this.delete(`circle/${circleId}`);
    }

    public uploadCircleImage(image: File, circleId: number): Observable<ApiResponse<string | null>> {
        return this.upload(image, 'circleImageFile', `upload/circle-img/${circleId}`);
    }

    public circleVoters(circleId: number, filter?: Partial<CircleVotersFilter>): Observable<ApiResponse<CircleVoter>> {
        let params: HttpParams | undefined = undefined;
        if (filter) {
            params = new HttpParams({ fromObject: filter });
        }
        return this.get({ paths: ['circle-voters', circleId] }, params);
    }

    public circleCandidates(circleId: number, filter?: Partial<CircleCandidatesFilter>): Observable<ApiResponse<CircleCandidate>> {
        let params: HttpParams | undefined = undefined;
        if (filter) {
            params = new HttpParams({ fromObject: filter });
        }
        return this.get({ paths: ['circle-candidates', circleId] }, params);
    }

    public createVote(circleId: number, voteCreate: VoteCreateRequest): Observable<ApiResponse<boolean>> {
        return this.create<VoteCreateRequest, boolean>(voteCreate, `vote/${circleId}`);
    }

    public revokeVote(circleId: number): Observable<ApiResponse<boolean>> {
        return this.create<object, boolean>({}, `vote/revoke/${circleId}`);
    }

    public updateCommitment(circleId: number, req: CircleCandidateCommitmentRequest): Observable<ApiResponse<Commitment>> {
        return this.create<CircleCandidateCommitmentRequest, Commitment>(req, `circle-candidates/${circleId}/commitment`);
    }

    public joinCircleAsVoter(circleId: number): Observable<ApiResponse<Voter>> {
        return this.create<unknown, Voter>(null, `circle-voters/${circleId}/join`);
    }

    public joinCircleAsCandidate(circleId: number): Observable<ApiResponse<Candidate>> {
        return this.create<unknown, Candidate>(null, `circle-candidates/${circleId}/join`);
    }

    public addCandidateToCircle(circleId: number, requests: CandidateRequest[]): Observable<ApiResponse<Candidate[]>> {
        return this.create<CandidateRequest[], Candidate[]>(requests, `circle-candidates/${circleId}/add`);
    }

    public addVoterToCircle(circleId: number, requests: VoterRequest[]): Observable<ApiResponse<Voter[]>> {
        return this.create<VoterRequest[], Voter[]>(requests, `circle-voters/${circleId}/add`);
    }

    public leaveCircleAsCandidate(circleId: number): Observable<ApiResponse<string>> {
        return this.delete<string>(`circle-candidates/${circleId}/leave`);
    }

    public leaveCircleAsVoter(circleId: number): Observable<ApiResponse<string>> {
        return this.delete<string>(`circle-voters/${circleId}/leave`);
    }

    public removeCandidateFromCircle(circleId: number, req: CandidateRequest): Observable<ApiResponse<string>> {
        return this.create<CandidateRequest, string>(req, `circle-candidates/${circleId}/remove`);
    }

    public removeVoterFromCircle(circleId: number, req: VoterRequest): Observable<ApiResponse<string>> {
        return this.create<VoterRequest, string>(req, `circle-voters/${circleId}/remove`);
    }

    public rankings(circleId: number): Observable<ApiResponse<Ranking[]>> {
        return this.get({
            paths: ['rankings', circleId]
        });
    }

    public userOption(): Observable<ApiResponse<UserOption>> {
        return this.get({
            paths: ['user-option']
        });
    }

    public eligibleToBeInCircle(id: number): Observable<ApiResponse<boolean>> {
        return this.get({ paths: ['circle', id, 'eligible'] });
    }

    public circleCandidateVotedBy(circleId: number, req: CandidateRequest): Observable<ApiResponse<string[]>> {
        const params = new HttpParams({
            fromObject: {
                candidate: req.candidate
            }
        });
        return this.get({ paths: ['circle-candidates', circleId, 'voted-by'] }, params);
    }
}
