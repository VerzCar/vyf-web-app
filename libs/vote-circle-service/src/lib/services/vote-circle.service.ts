import { inject, Injectable } from '@angular/core';
import { ApiBaseService, ApiResponse, BASE_API_USE_MOCK } from '@vyf/base';
import { Observable } from 'rxjs';
import { Circle, VoteCreate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService {
  private readonly useMock = inject(BASE_API_USE_MOCK);

  protected get endpointPath(): string {
	return 'v1/api/vote-circle';
  }

  public circle(id: number): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.getMock('id') : this.get(id, 'circle');
  }

  public createCircle(circle: Circle): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.createMock('id') : this.create(circle, 'circle');
  }

  public updateCircle(circle: Partial<Circle>): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.updateMock('id') : this.update(circle, 'circle');
  }

  public createVote(voteCreate: VoteCreate): Observable<ApiResponse<boolean>> {
	return this.useMock ? this.createMock('id') : this.create<VoteCreate, boolean>(voteCreate, 'vote');
  }

  public rankings(circleId: number): Observable<ApiResponse<Circle>> {
	return this.useMock ? this.getMock('id') : this.get(circleId, 'rankings');
  }
}
