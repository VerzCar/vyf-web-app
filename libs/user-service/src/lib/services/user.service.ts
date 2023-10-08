import { inject, Injectable } from '@angular/core';
import { ApiBaseService, ApiResponse, BASE_API_USE_MOCK } from '@vyf/base';
import { User } from '../models';
import { Observable } from 'rxjs';

import * as userId02 from '../mocks/user-id-2.json';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiBaseService {
  private readonly useMock = inject(BASE_API_USE_MOCK);

  protected get endpointPath(): string {
	return 'v1/api/user';
  }

  public me(): Observable<ApiResponse<User>> {
	return this.useMock ? this.getMock(userId02 as unknown as User) : this.get();
  }

  public x(id: string): Observable<ApiResponse<User>> {
	return this.useMock ? this.getMock(userId02 as unknown as User) : this.get({id});
  }

  public updateUser(user: Partial<User>): Observable<ApiResponse<User>> {
	return this.useMock ? this.updateMock(userId02 as unknown as User) : this.update(user, 'update');
  }

}
