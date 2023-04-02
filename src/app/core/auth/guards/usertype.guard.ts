import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree } from '@angular/router';
import { delay, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({
	providedIn: 'root',
})
export class UserTypeGuard implements CanMatch {
	user: User;

	/**
	 * Constructor
	 */
	constructor(private _userService: UserService) {}

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
		if (!this._userService.user$.value.id) {
			return of(false);
		} else {
			this.user = this._userService.user$.value;
		}

		if (this.user.type === 'pf-admin' && segments[0].path === 'pf-dashboard')
			return of(true);
		else if (this.user.type === 'pj-admin' && segments[0].path === 'pj-dashboard')
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
}
