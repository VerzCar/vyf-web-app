import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiBaseService, ApiResponse, BASE_API_USE_MOCK } from '@vyf/base';
import { Observable } from 'rxjs';

import * as circleId04 from '../mocks/circle-id-4.json';
import * as circlesIdentityVerzcar from '../mocks/circles-identity-verzcar.json';
import * as rankingsCircleId04 from '../mocks/rankings-circle-id-4.json';
import {
    Circle,
    CircleCreateRequest,
    CirclePaginated,
    CircleUpdateRequest,
    CircleVoter,
    CircleVotersFilter,
    Ranking,
    VoteCreateRequest
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService {
    private readonly useMock = inject(BASE_API_USE_MOCK);

    protected get endpointPath(): string {
        return 'v1/api/vote-circle';
    }

    public circle(id: number): Observable<ApiResponse<Circle>> {
        return this.useMock ? this.getMock(circleId04 as unknown as Circle) : this.get({ paths: ['circle', id] });
    }

    public circles(): Observable<ApiResponse<Circle[]>> {
        return this.useMock ? this.getMock(circlesIdentityVerzcar as unknown as Circle[]) : this.getAll({ paths: ['circles'] });
    }

    public circlesFiltered(name: string): Observable<ApiResponse<CirclePaginated[]>> {
        return this.useMock ? this.getMock(circlesIdentityVerzcar as unknown as CirclePaginated[]) : this.getAll({ paths: ['circles', name] });
    }

    public circlesOfInterest(): Observable<ApiResponse<CirclePaginated[]>> {
        return this.useMock ? this.getMock(circlesIdentityVerzcar as unknown as CirclePaginated[]) : this.getAll({ paths: ['circles', 'of-interest'] });
    }

    public createCircle(circle: CircleCreateRequest): Observable<ApiResponse<Circle>> {
        return this.useMock ? this.createMock(circleId04 as unknown as Circle) : this.create(circle, 'circle');
    }

    public updateCircle(circle: Partial<CircleUpdateRequest>): Observable<ApiResponse<Circle>> {
        return this.useMock ? this.updateMock(circleId04 as unknown as Circle) : this.update(circle, 'circle');
    }

    public uploadCircleImage(image: File, circleId: number): Observable<ApiResponse<string | null>> {
        return this.useMock ? this.getMock('') : this.upload(image, 'circleImageFile', `upload/circle-img/${circleId}`);
    }

    public circleVoters(circleId: number, filter?: Partial<CircleVotersFilter>): Observable<ApiResponse<CircleVoter>> {
        let params: HttpParams | undefined = undefined;
        if (filter) {
            params = new HttpParams({ fromObject: filter });
        }
        console.log(filter);
        return this.useMock ? this.getMock(circlesIdentityVerzcar as unknown as CircleVoter) : this.get({ paths: ['circle-voters', circleId] }, params);
    }

    public createVote(voteCreate: VoteCreateRequest): Observable<ApiResponse<boolean>> {
        return this.useMock ? this.createMock(true) : this.create<VoteCreateRequest, boolean>(voteCreate, 'vote');
    }

    public rankings(circleId: number): Observable<ApiResponse<Ranking[] | null>> {
        return this.useMock ? this.getMock(rankingsCircleId04 as unknown as Ranking[]) : this.get({
            paths: ['rankings', circleId]
        });
    }

    public rankingsEvents(circleId: number): Observable<Ranking[]> {
        return this.sseEvents({
            paths: ['stream', 'rankings', circleId]
        });
    }

    public eligibleToBeInCircle(id: number): Observable<ApiResponse<boolean>> {
        return this.useMock ? this.getMock(true) : this.get({ paths: ['circle', id, 'eligible'] });
    }
}
