import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { finance } from './user-funct-test';

@Injectable({
	providedIn: 'root',
})
export class UserFunctDataService {
	private _data: BehaviorSubject<any> = new BehaviorSubject(null);
	private _finance: any = finance;
	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for data
	 */
	get data$(): Observable<any> {
		this._data.next({ ...this._finance });
		return this._data.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get data
	 */
	getData(): Observable<any> {
		return this._httpClient.get('api/dashboards/finance').pipe(
			tap((response: any) => {
				this._data.next(response);
			})
		);
	}
}
