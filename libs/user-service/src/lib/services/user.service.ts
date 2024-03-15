import { inject, Injectable, InjectionToken } from '@angular/core';
import { ApiBaseService, ApiResponse } from '@vyf/base';
import { Observable } from 'rxjs';
import { User, UserPaginated } from '../models';

export const USER_API_URL = new InjectionToken<string>('User API Url', {
    providedIn: 'any',
    factory: () => window.location.origin
});

@Injectable({
    providedIn: 'root'
})
export class UserService extends ApiBaseService {
    private readonly _baseUrl = inject(USER_API_URL);

    protected get baseUrl(): string {
        return this._baseUrl;
    }
    protected get endpointPath(): string {
        return 'v1/api/user';
    }

    public me(): Observable<ApiResponse<User>> {
        return this.get();
    }

    public x(id: string): Observable<ApiResponse<User>> {
        return this.get({ paths: [id] });
    }

    public users(): Observable<ApiResponse<UserPaginated[]>> {
        return this.getAll({ paths: ['users'] });
    }

    public usersFiltered(username: string): Observable<ApiResponse<UserPaginated[]>> {
        return this.getAll({ paths: ['users', username] });
    }

    public uploadUserProfileImage(image: File): Observable<ApiResponse<string | null>> {
        return this.upload(image, 'profileImageFile', 'upload/profile-img');
    }

    public updateUser(user: Partial<User>): Observable<ApiResponse<User>> {
        return this.update(user, 'update');
    }

}
