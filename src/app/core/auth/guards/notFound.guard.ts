import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { delay, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({
	providedIn: 'root',
})
export class NotFoundGuard implements CanMatch {
	user: User;

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
		return this._authService.check().pipe(
			switchMap((authenticated) => {
				// If the user is authenticated...
				if (authenticated) {
					if (!this._userService.user$.value.id) {
						return of(false);
					} else {
						this.user = this._userService.user$.value;
					}

					if (this.user.type === 'user')
						this._router.navigateByUrl('/user/dashboard');
					else if (this.user.type === 'firma-admin')
						this._router.navigateByUrl('/admin/firma-dashboard');
					else if (this.user.type === 'hybrid-admin')
						this._router.navigateByUrl('/admin/hybrid-dashboard');
					else if (this.user.type === 'master-admin')
						this._router.navigateByUrl('/admin/master-dashboard');
				} else {
					this._router.navigateByUrl('/auth/sign-in');
				}
			})
		);
	}
}
