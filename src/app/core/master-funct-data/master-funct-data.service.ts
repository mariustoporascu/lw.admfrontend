import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
	Documente,
	FirmaDiscount,
	Tranzactii,
} from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';

@Injectable({
	providedIn: 'root',
})
export class MasterFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _firmeData: BehaviorSubject<FirmaDiscount[] | null> =
		new BehaviorSubject(null);
	private _firmaExtendedData: BehaviorSubject<FirmaDiscount | null> =
		new BehaviorSubject(null);
	private _documenteData: BehaviorSubject<Documente[] | null> =
		new BehaviorSubject(null);
	private _preApprovalDocsData: BehaviorSubject<Documente[] | null> =
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
	get firmeData$(): Observable<any> {
		return this._firmeData.asObservable();
	}
	/**
	 * Getter for approvedData
	 */
	get firmaExtendedData$(): Observable<any> {
		return this._firmaExtendedData.asObservable();
	}
	/**
	 * Getter for transfer
	 */
	get documenteData$(): Observable<any> {
		return this._documenteData.asObservable();
	}

	/**
	 * Getter for withdraw
	 */
	get preApprovalDocsData$(): Observable<any> {
		return this._preApprovalDocsData.asObservable();
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
	getAllDocuments(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/masteradmin/getDocumente`)
			.pipe(
				tap((response: any) => {
					this._documenteData.next(response ?? []);
				})
			);
	}
	/**
	 * Get approved
	 */
	getPreApprovalDocuments(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/masteradmin/getDocumentePreApproval`)
			.pipe(
				tap((response: any) => {
					this._preApprovalDocsData.next(response ?? []);
				})
			);
	}
	/**
	 * Get approved
	 */
	getAllFirme(): Observable<FirmaDiscount[]> {
		return this._httpClient
			.get<FirmaDiscount[]>(`${this._backEndUrl}/masteradmin/getFirme`)
			.pipe(
				tap((response: any) => {
					this._firmeData.next(response ?? []);
				})
			);
	}
	/**
	 * Get approved
	 */
	getFirmaExtended(id: string): Observable<FirmaDiscount> {
		return this._httpClient
			.get<FirmaDiscount>(
				`${this._backEndUrl}/masteradmin/getFirmaExtendedDetails?firmaId=${id}`
			)
			.pipe(
				tap((response: any) => {
					this._firmaExtendedData.next(response ?? []);
				})
			);
	}
	/**
	 * Make Tranzaction
	 */
	updateDocStatus(documentId: string, status: number): Observable<any> {
		return this._httpClient.put(
			`${this._backEndUrl}/masteradmin/changeDocStatus`,
			{},
			{
				params: {
					documentId,
					status,
				},
			}
		);
	}
	/**
	 * Query user
	 */
	queryUsers(query: string): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/masteradmin/query-users?query=${query}`
		);
	}
}
