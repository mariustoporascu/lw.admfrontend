import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	Resolve,
	Router,
	RouterStateSnapshot,
} from '@angular/router';
import { FileManagerService } from 'app/core/filemanager/file-manager.service';
import { Item, Items } from 'app/core/filemanager/file-manager.types';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class FileManagerItemsResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(private _fileManagerService: FileManagerService) {}

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
	): Observable<Items> {
		return this._fileManagerService.setItems();
	}
}

@Injectable({
	providedIn: 'root',
})
export class FileManagerFolderResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(
		private _router: Router,
		private _fileManagerService: FileManagerService
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
	): Observable<Items> {
		return this._fileManagerService.setItems(route.paramMap.get('folderId')).pipe(
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

@Injectable({
	providedIn: 'root',
})
export class FileManagerItemResolver implements Resolve<any> {
	/**
	 * Constructor
	 */
	constructor(
		private _router: Router,
		private _fileManagerService: FileManagerService
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
	): Observable<Item> {
		return this._fileManagerService.setItemById(route.paramMap.get('id')).pipe(
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
