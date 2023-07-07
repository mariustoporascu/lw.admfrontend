import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Documente, Tranzactii } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class MasterFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _operatiuniData: BehaviorSubject<Documente[] | null> =
		new BehaviorSubject(null);
	private _transferData: BehaviorSubject<Tranzactii[] | null> =
		new BehaviorSubject(null);
	private _withdrawData: BehaviorSubject<Tranzactii[] | null> =
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

	/**
	 * Getter for transfer
	 */
	get transferData$(): Observable<any> {
		return this._transferData.asObservable();
	}

	/**
	 * Getter for withdraw
	 */
	get withdrawData$(): Observable<any> {
		return this._withdrawData.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get data
	 */
	getDashboardData(): Observable<any> {
		return this._httpClient
			.get(`${this._backEndUrl}/masteradmin/getDashboardData`)
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
			.get<Documente[]>(`${this._backEndUrl}/hybrid/getAllDocumenteOperatii`)
			.pipe(
				tap((response: any) => {
					this._operatiuniData.next(response ?? []);
				})
			);
	}

	/**
	 * Get transfer
	 */
	getTransferData(): Observable<Tranzactii[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/hybrid/getAllTransfers`)
			.pipe(
				tap((response: any) => {
					this._transferData.next(response ?? []);
				})
			);
	}

	/**
	 * Make Tranzaction
	 */
	addTranzaction(body: {}): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/hybrid/addTranzaction`,
			body
		);
	}

	/**
	 * Query user
	 */
	queryUsers(query: string): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/hybrid/query-users?query=${query}`
		);
	}
}
