import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	RouterStateSnapshot,
} from '@angular/router';
import { HybridFunctDataService } from 'app/core/hybrid-funct-data/hybrid-funct-data.service';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class UserTransfDataResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _userFunctDataService: HybridFunctDataService) {}

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
		return this._userFunctDataService.getTransferData();
	}
}
