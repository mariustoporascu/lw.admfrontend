import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { delay, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Injectable({
	providedIn: 'root',
})
export class NoAuthGuard implements CanMatch {
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
		return this._authService.check().pipe(
			switchMap((authenticated) => {
				// If the user is authenticated...
				if (authenticated) {
					// Redirect to the main page according to the user role
					while (!this.user) {
						// Wait for the user to be loaded
					}
					this._unsubscribeAll.next(null);
					this._unsubscribeAll.complete();
					if (this.user) {
						if (this.user.type === 'pf-admin')
							this._router.navigateByUrl('/admin/pf-dashboard');
						else if (this.user.type === 'pj-admin')
							this._router.navigateByUrl('/admin/pj-dashboard');
						else if (this.user.type === 'master-admin')
							this._router.navigateByUrl('/admin/master-dashboard');
					}
				}

				// Allow the access
				return of(!authenticated);
			})
		);
	}
}
