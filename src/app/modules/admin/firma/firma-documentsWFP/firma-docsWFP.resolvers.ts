import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	RouterStateSnapshot,
} from '@angular/router';
import { FirmaFunctDataService } from 'app/core/firma-funct-data/firma-funct-data.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FirmaDocsWFPResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _firmaFunctDataService: FirmaFunctDataService) {}

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
		return this._firmaFunctDataService.getDocumentsWFP();
	}
}
