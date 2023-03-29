import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import {
	FuseNavigationItem,
	FuseNavigationService,
} from '@fuse/components/navigation';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SearchService {
	private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;

	/**
	 * Constructor
	 */
	constructor(private _fuseNavigationService: FuseNavigationService) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Register Mock API handlers
	 */
	getSearchResult(query: string): Observable<any> {
		// Get the flat navigation and store it
		const flatNavigation = this._fuseNavigationService.getFlatNavigation(
			this._defaultNavigation
		);

		// -----------------------------------------------------------------------------------------------------
		// @ Search results - GET
		// -----------------------------------------------------------------------------------------------------
		// If the search query is an empty string,
		// return an empty array
		if (query === '') {
			return of([]);
		}

		// Filter the navigation
		const pagesResults = cloneDeep(flatNavigation).filter(
			(page) =>
				page.title?.toLowerCase().includes(query) ||
				(page.subtitle && page.subtitle.includes(query))
		);

		// Prepare the results array
		const results = [];

		// If there are page results...
		if (pagesResults.length > 0) {
			// Normalize the results
			pagesResults.forEach((result: any) => {
				// Add the page title as the value
				result.value = result.title;
			});

			// Add to the results
			results.push({
				id: 'pages',
				label: 'Pages',
				results: pagesResults,
			});
		}

		// Return the response
		return of(results);
	}
}
