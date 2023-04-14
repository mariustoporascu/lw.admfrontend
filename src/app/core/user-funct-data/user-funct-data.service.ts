import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { finance } from './user-funct-test';
import { Documente } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class UserFunctDataService {
	private _data: BehaviorSubject<any> = new BehaviorSubject(null);
	private _approvedDocuments: BehaviorSubject<Documente[] | null> =
		new BehaviorSubject(null);
	private _finance: any = finance;
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
	get data$(): Observable<any> {
		this._data.next({ ...this._finance });
		return this._data.asObservable();
	}

	/**
	 * Getter for approvedData
	 */
	get approvedDocuments$(): Observable<any> {
		this._data.next({ ...this._finance });
		return this._approvedDocuments.asObservable();
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

	/**
	 * Get approved
	 */
	getApprovedDocuments(): Observable<any> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/regularuser/getAllDocumenteApproved`)
			.pipe(
				tap((response: any) => {
					this._approvedDocuments.next(response ?? []);
				})
			);
	}
}
