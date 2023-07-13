import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';
import { catchError, forkJoin, Observable, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MasterFirmeResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _masterFunctDataService: MasterFunctDataService) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Resolver
	 *
	 * @param route
	 * @param state
	 */
	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		return this._masterFunctDataService.getAllFirme();
	}
}

@Injectable({
	providedIn: 'root',
})
export class MasterFirmaResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(
		private _router: Router,
		private _masterFunctDataService: MasterFunctDataService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Resolver
	 *
	 * @param route
	 * @param state
	 */
	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		return this._masterFunctDataService
			.getFirmaExtended(route.paramMap.get('id'))
			.pipe(
				// Error here means the requested task is not available
				catchError((error) => {
					// Log the error
					console.error(error);

					// Get the parent url
					const parentUrl = state.url.split('/').slice(0, -1).join('/');

					// Navigate to there
					this._router.navigateByUrl(parentUrl);

					// Throw an error
					return throwError(error);
				})
			);
	}
}
