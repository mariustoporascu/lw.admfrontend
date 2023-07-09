import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	RouterStateSnapshot,
} from '@angular/router';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MasterDocsResolver implements Resolve<any> {
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
		return forkJoin([
			this._masterFunctDataService.getAllDocuments(),
			this._masterFunctDataService.getAllFirme(),
		]);
	}
}
