import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { delay, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({
	providedIn: 'root',
})
export class UserTypeGuard implements CanMatch {
	user: User;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _authService: AuthService,
		private _router: Router,
		private _userService: UserService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Can match
	 *
	 * @param route
	 * @param segments
	 */
	canMatch(
		route: Route,
		segments: UrlSegment[]
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		return this._check(segments);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Private methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Check the authenticated status
	 *
	 * @private
	 */
	private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
		// Check the authentication status and return an observable of
		// "true" or "false" to allow or prevent the access
		this._userService.user$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((user) => {
				this.user = user;
			});
		while (!this.user) {
			// Wait for the user to be loaded
		}
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
		if (this.user) {
			if (this.user.type === 'pf-admin' && segments[0].path === 'pf-dashboard')
				return of(true);
			else if (
				this.user.type === 'pj-admin' &&
				segments[0].path === 'pj-dashboard'
			)
				return of(true);
			else if (
				this.user.type === 'firma-admin' &&
				segments[0].path === 'firma-dashboard'
			)
				return of(true);
			else if (
				this.user.type === 'hybrid-admin' &&
				segments[0].path === 'hybrid-dashboard'
			)
				return of(true);
			else if (
				this.user.type === 'master-admin' &&
				segments[0].path === 'master-dashboard'
			)
				return of(true);
			else {
				return of(false);
			}
		}
		return of(false);
	}
}
