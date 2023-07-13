import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Documente, Tranzactii } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class UserFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _operatiuniData: BehaviorSubject<Documente[] | null> =
		new BehaviorSubject(null);
	private _transferData: BehaviorSubject<Tranzactii[] | null> =
		new BehaviorSubject(null);
	private _withdrawData: BehaviorSubject<Tranzactii[] | null> =
		new BehaviorSubject(null);
	private _favoritesData: BehaviorSubject<any[] | null> = new BehaviorSubject(
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

	/**
	 * Get transfer
	 */
	getTransferData(): Observable<Tranzactii[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/regularuser/getAllTransfers`)
			.pipe(
				tap((response: any) => {
					this._transferData.next(response ?? []);
				})
			);
	}

	/**
	 * Get withdraw
	 */
	getWithdrawData(): Observable<Tranzactii[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/regularuser/getAllWithdrawals`)
			.pipe(
				tap((response: any) => {
					this._withdrawData.next(response ?? []);
				})
			);
	}

	/**
	 * Make Tranzaction
	 */
	addTranzaction(body: {}): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/regularuser/addTranzaction`,
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
	addFavorite(favConexId: string): Observable<any> {
		return this._httpClient.put(
			`${this._backEndUrl}/regularuser/add-favorite-user`,
			{},
			{ params: { favConexId } }
		);
	}
	removeFavorite(favConexId: string): Observable<any> {
		return this._httpClient.delete(
			`${this._backEndUrl}/regularuser/remove-favorite-user?favConexId=${favConexId}`
		);
	}
	getFavoriteList(): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/regularuser/get-favorite-users`
		);
	}
}
