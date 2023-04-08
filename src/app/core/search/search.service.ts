import { Injectable } from '@angular/core';
import {
	FuseNavigationItem,
	FuseNavigationService,
} from '@fuse/components/navigation';
import { Observable, of } from 'rxjs';
import { defaultNavigation } from '../navigation/navigation.data';
import { UserService } from '../user/user.service';

@Injectable({
	providedIn: 'root',
})
export class SearchService {
	private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;

	/**
	 * Constructor
	 */
	constructor(
		private _fuseNavigationService: FuseNavigationService,
		private _userService: UserService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Register Mock API handlers
	 */
	getSearchResult(query: string): Observable<any> {
		// Get the flat navigation and store it
		const flatNavigation = this._fuseNavigationService.getFlatNavigation(
			this._defaultNavigation,
			[],
			this._userService.user$.value.type
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
		const pagesResults = [...flatNavigation].filter(
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
				label: 'Pagini',
				results: pagesResults,
			});
		}

		// Return the response
		return of(results);
	}
}
