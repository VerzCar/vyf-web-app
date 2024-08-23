import { inject, Injectable } from '@angular/core';
import { User, UserService } from '@vyf/user-service';
import { catchError, firstValueFrom, map, of, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    private _user: User | undefined;

    private readonly userService = inject(UserService);

    public get user(): User | undefined {
        return this._user;
    }

    public initUser(): Promise<User | undefined> {
        if (!this.user) {
            return firstValueFrom(this.userService.me().pipe(
                map(res => res.data),
                tap(user => this._user = user),
                catchError(() => of(undefined))
            ));
        }

        return new Promise(res => res(this.user));
    }

    public clear(): void {
        this._user = undefined;
    }
}
