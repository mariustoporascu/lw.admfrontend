import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Documente } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class UserFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _operatiuniData: BehaviorSubject<Documente[] | null> =
		new BehaviorSubject(null);
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
	get operatiuniData$(): Observable<any> {
		return this._operatiuniData.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get data
	 */
	getDashboardData(): Observable<any> {
		return this._httpClient
			.get(`${this._backEndUrl}/regularuser/getDashboardData`)
			.pipe(
				tap((response: any) => {
					this._dashboardData.next(response);
				})
			);
	}

	/**
	 * Get approved
	 */
	getApprovedDocuments(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/regularuser/getAllDocumenteOperatii`)
			.pipe(
				tap((response: any) => {
					this._operatiuniData.next(response ?? []);
				})
			);
	}
}
