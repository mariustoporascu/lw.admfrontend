import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, Observable, ReplaySubject, tap } from 'rxjs';
import { User } from 'app/core/user/user.types';
import { AuthUtils } from '../auth/auth.utils';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private _user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------
	get accessToken(): string {
		return localStorage.getItem('accessToken') ?? '';
	}
	/**
	 * Setter & getter for user
	 *
	 * @param value
	 */
	set user(value: User) {
		// Store the value
		this._user.next(value);
	}

	get user$(): BehaviorSubject<User> {
		if (!AuthUtils.isTokenExpired(this.accessToken)) {
			const user = AuthUtils._decodeToken(this.accessToken);
			this.user = {
				id: user.sub,
				name: user.name,
				firstName: user.firstName,
				email: user.email,
				phoneNumber: user.phone,
				type: user.type,
			} as User;
		} else {
			this.user = {} as User;
		}

		return this._user;
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get the current logged in user data
	 */
	get(): Observable<User> {
		return this._httpClient.get<User>('api/common/user').pipe(
			tap((user) => {
				this._user.next(user);
			})
		);
	}

	/**
	 * Update the user
	 *
	 * @param user
	 */
	update(user: User): Observable<any> {
		return this._httpClient.patch<User>('api/common/user', { user }).pipe(
			map((response) => {
				this._user.next(response);
			})
		);
	}
}
