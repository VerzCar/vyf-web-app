import { inject, Injectable } from '@angular/core';
import { ApiBaseService, ApiResponse, BASE_API_USE_MOCK } from '@vyf/base';
import { Observable } from 'rxjs';
import { Circle, Ranking, VoteCreate } from '../models';

import * as circleId04 from '../mocks/circle-id-4.json';
import * as rankingsCircleId04 from '../mocks/rankings-circle-id-4.json';

@Injectable({
  providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService {
  private readonly useMock = inject(BASE_API_USE_MOCK);

  protected get endpointPath(): string {
	return 'v1/api/vote-circle';
  }

  public circle(id: number): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.getMock(circleId04 as unknown as Circle) : this.get(id, 'circle');
  }

  public createCircle(circle: Circle): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.createMock(circleId04 as unknown as Circle) : this.create(circle, 'circle');
  }

  public updateCircle(circle: Partial<Circle>): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.updateMock(circleId04 as unknown as Circle) : this.update(circle, 'circle');
  }

  public createVote(voteCreate: VoteCreate): Observable<ApiResponse<boolean>> {
	return this.useMock ? this.createMock(true) : this.create<VoteCreate, boolean>(voteCreate, 'vote');
  }

  public rankings(circleId: number): Observable<ApiResponse<Ranking[]>> {
	return this.useMock ? this.getMock(rankingsCircleId04 as unknown as Ranking[]) : this.get(circleId, 'rankings');
  }
}
