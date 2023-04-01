import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { cloneDeep } from 'lodash';
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
	get navigation$(): Observable<Navigation> {
		this._navigation.next({
			default: cloneDeep(this._defaultNavigation),
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
			default: cloneDeep(this._defaultNavigation),
		} as Navigation);
		return this._navigation.asObservable();
	}
}
