import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Documente, Hybrid, Tranzactii } from '../bkendmodels/models.types';
import { backendUrl } from '../config/app.config';
import { StatusEnumRO } from '../bkendmodels/enums.types';

@Injectable({
	providedIn: 'root',
})
export class FirmaFunctDataService {
	private _dashboardData: BehaviorSubject<any> = new BehaviorSubject(null);
	private _docsData: BehaviorSubject<Documente[] | null> = new BehaviorSubject(
		null
	);
	private _externalUsrsData: BehaviorSubject<Hybrid[] | null> =
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
	get docsData$(): Observable<any> {
		return this._docsData.asObservable();
	}

	get externalUsrsData$(): Observable<any> {
		return this._externalUsrsData.asObservable();
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
					response &&
						response.latestDocs.forEach((element: Documente) => {
							element.statusName = StatusEnumRO[element.status];
						});
					this._dashboardData.next(response);
				})
			);
	}

	/**
	 * Get approved
	 */
	getDocumentsWFP(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(
				`${this._backEndUrl}/FirmaDiscount/getAllDocumentsForApproval`
			)
			.pipe(
				tap((response: any) => {
					response &&
						response.forEach((element: Documente) => {
							element.statusName = StatusEnumRO[element.status];
						});
					this._docsData.next(response ?? []);
				})
			);
	}
	/**
	 * Get approved
	 */
	getAllDocuments(): Observable<Documente[]> {
		return this._httpClient
			.get<Documente[]>(`${this._backEndUrl}/FirmaDiscount/getAllDocuments`)
			.pipe(
				tap((response: any) => {
					response &&
						response.forEach((element: Documente) => {
							if (element.nextConexiuniConturi) {
								element.conexiuniConturi = element.nextConexiuniConturi;
							}
							element.statusName = StatusEnumRO[element.status];
						});
					this._docsData.next(response ?? []);
				})
			);
	}

	getExternalUsers(): Observable<Hybrid[]> {
		return this._httpClient
			.get<Hybrid[]>(`${this._backEndUrl}/FirmaDiscount/getFirmaPuncteDeLucru`)
			.pipe(
				tap((response: any) => {
					if (response) {
						response.forEach((element: Hybrid) => {
							element.isEditMode = false;
						});
					}
					this._externalUsrsData.next(response ?? []);
				})
			);
	}
	deleteExternalGroups(body: {}): Observable<any> {
		return this._httpClient.delete(
			`${this._backEndUrl}/FirmaDiscount/deletePuncteDeLucru`,
			body
		);
	}
	createHybrid(createPunctDeLucruDTO: {
		name: string;
		initialEmail: string;
		initialPassword: string;
	}): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/FirmaDiscount/createPunctDeLucru`,
			createPunctDeLucruDTO
		);
	}
	updateHybrid(updatePunctDeLucruDTO: {
		name: string;
		id: string;
	}): Observable<any> {
		return this._httpClient.put(
			`${this._backEndUrl}/FirmaDiscount/updatePunctDeLucru`,
			{},
			{
				params: {
					name: updatePunctDeLucruDTO.name,
					entityId: updatePunctDeLucruDTO.id,
				},
			}
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
	checkIfEmailNotTaken(query: string): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/FirmaDiscount/checkIfEmailNotTaken?email=${query}`
		);
	}
}
