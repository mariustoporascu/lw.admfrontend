import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Documente, Tranzactii } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class FirmaFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _docsData: BehaviorSubject<Documente[] | null> = new BehaviorSubject(
		null
	);

	private _backEndUrl: string = backendUrl;
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
	get dashboardData$(): Observable<any> {
		return this._dashboardData.asObservable();
	}

	/**
	 * Getter for approvedData
	 */
	get docsData$(): Observable<any> {
		return this._docsData.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get data
	 */
	getDashboardData(): Observable<any> {
		return this._httpClient
			.get(`${this._backEndUrl}/FirmaDiscount/getDashboardData`)
			.pipe(
				tap((response: any) => {
					this._dashboardData.next(response);
				})
			);
	}

	/**
	 * Get approved
	 */
	getDocumentsWFP(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/FirmaDiscount/getAllDocumenteWFP`)
			.pipe(
				tap((response: any) => {
					this._docsData.next(response ?? []);
				})
			);
	}

	/**
	 * Make Tranzaction
	 */
	updateDocStatus(body: {}): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/FirmaDiscount/updateDocStatus`,
			body
		);
	}
	/**
	 * Query user
	 */
	queryUsers(query: string): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/regularuser/query-users?query=${query}`
		);
	}
}
