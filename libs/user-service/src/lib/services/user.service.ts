import { Injectable } from '@angular/core';
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

  public me(id = ''): Observable<User> {
	return this.get(id);
  }

  public updateUser(user: Partial<User>): Observable<User> {
	return this.update(user);
  }

}
