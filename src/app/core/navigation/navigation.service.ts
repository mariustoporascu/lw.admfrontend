import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { defaultNavigation } from './navigation.data';

@Injectable({
	providedIn: 'root',
})
export class NavigationService {
	private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
	private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(
		1
	);

	/**
	 * Constructor
	 */
	constructor() {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for navigation
	 */
	getNavigation(userType: string): Observable<Navigation> {
		this._navigation.next({
			default: [
				...this._defaultNavigation.filter((item) => {
					if (item.userType === userType) return true;
					return false;
				}),
			],
		} as Navigation);
		return this._navigation.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get all navigation data
	 */
	get(): Observable<Navigation> {
		this._navigation.next({
			default: [...this._defaultNavigation],
		} as Navigation);
		return this._navigation.asObservable();
	}
}
