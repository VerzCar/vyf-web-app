import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiBaseService, ApiResponse } from '@vyf/base';
import { Observable } from 'rxjs';

import { Circle, CircleCandidate, CircleCreateRequest, CirclePaginated, CircleUpdateRequest, CircleVoter, CircleVotersFilter, Commitment, Ranking, VoteCreateRequest, Voter } from '../models';
import { Candidate } from '../models/candidate.model';
import { CircleCandidateCommitmentRequest } from '../models/circle-candidate-commitment-request.model';
import { CircleCandidatesFilter } from '../models/circle-candidates-filter.model';

@Injectable({
    providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService {
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

    public createCircle(circle: CircleCreateRequest): Observable<ApiResponse<Circle>> {
        return this.create(circle, 'circle');
    }

    public updateCircle(circle: Partial<CircleUpdateRequest>): Observable<ApiResponse<Circle>> {
        return this.update(circle, 'circle');
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

    public updateCommitment(circleId: number, req: CircleCandidateCommitmentRequest): Observable<ApiResponse<Commitment>> {
        return this.create<CircleCandidateCommitmentRequest, Commitment>(req, `circle-candidates/${circleId}/commitment`);
    }

    public joinCircleAsVoter(circleId: number): Observable<ApiResponse<Voter>> {
        return this.create<unknown, Voter>(null, `circle-voters/${circleId}/join`);
    }

    public joinCircleAsCandidate(circleId: number): Observable<ApiResponse<Candidate>> {
        return this.create<unknown, Candidate>(null, `circle-candidates/${circleId}/join`);
    }

    public leaveCircleAsCandidate(circleId: number): Observable<ApiResponse<string>> {
        return this.delete<string>(`circle-candidates/${circleId}/leave`);
    }

    public leaveCircleAsVoter(circleId: number): Observable<ApiResponse<string>> {
        return this.delete<string>(`circle-voters/${circleId}/leave`);
    }

    public rankings(circleId: number): Observable<ApiResponse<Ranking[]>> {
        return this.get({
            paths: ['rankings', circleId]
        });
    }

    public eligibleToBeInCircle(id: number): Observable<ApiResponse<boolean>> {
        return this.get({ paths: ['circle', id, 'eligible'] });
    }
}
