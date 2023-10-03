import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { ApiResponse } from '../models';
import { Circle } from '../models/circle.model';
import { VoteCreate } from '../models/vote-create.model';
import { Voter } from '../models/voter.model';
import { ApiBaseService } from './base/api-base.service';

@Injectable({
  providedIn: 'root'
})
export class VoteCircleService extends ApiBaseService<Circle> {

  protected get endpointPath(): string {
	return 'v1/api/vote-circle';
  }

  public circle(id: number): Observable<ApiResponse<Circle>> {
	return this.get(id, 'circle');
  }

  public createCircle(circle: Circle): Observable<ApiResponse<Circle>> {
	return this.create(circle, 'circle');
  }

  public updateCircle(circle: Partial<Circle>): Observable<ApiResponse<Circle>> {
	return this.update(circle, 'circle');
  }

  public createVote(voteCreate: VoteCreate): Observable<ApiResponse<boolean>> {
	const url = `${this.url}/vote`;

	return this.httpClient.post<ApiResponse<boolean>>(
	  url,
	  voteCreate).pipe(
	  retry(this.retryCount)
	);
  }

  public rankings(circleId: number): Observable<ApiResponse<Circle>> {
	return this.get(circleId, 'rankings');
  }
}
