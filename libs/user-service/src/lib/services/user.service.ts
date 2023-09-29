import { Injectable } from '@angular/core';
import { ApiResponse } from '../models/api-response.model';
import { ApiBaseService } from './base/api-base.service';
import { User } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiBaseService<User> {

  protected get endpointPath(): string {
	return 'v1/api/user';
  }

  public me(): Observable<ApiResponse<User>> {
	return this.get();
  }

  public x(id: string): Observable<ApiResponse<User>> {
	return this.get(id);
  }

  public updateUser(user: Partial<User>): Observable<ApiResponse<User>> {
	return this.update(user);
  }

}
