import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { UserOperationsComponent } from '../user-operations.component';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';

@Component({
	selector: 'search-user',
	templateUrl: './search-user.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForUserComponent implements OnInit, OnDestroy {
	searchControl: UntypedFormControl = new UntypedFormControl();
	@Input() debounce: number = 500;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@Input() minLength: number = 2;
	resultSets: any[];

	/**
	 * Constructor
	 */
	constructor(
		private _userOperationsComponent: UserOperationsComponent,
		private _userFunctDataService: UserFunctDataService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this._userOperationsComponent.matDrawer.open();
		// Subscribe to the search field value changes
		this.searchControl.valueChanges
			.pipe(
				debounceTime(this.debounce),
				takeUntil(this._unsubscribeAll),
				map((value) => {
					// Set the resultSets to null if there is no value or
					// the length of the value is smaller than the minLength
					// so the autocomplete panel can be closed
					if (!value || value.length < this.minLength) {
						this.resultSets = null;
					}

					// Continue
					return value;
				}),
				// Filter out undefined/null/false statements and also
				// filter out the values that are smaller than minLength
				filter((value) => value && value.length >= this.minLength)
			)
			.subscribe((value) => {
				this._userFunctDataService.queryUsers(value).subscribe((resultSets) => {
					this.resultSets = resultSets;
				});
				console.log(this.resultSets);
			});
	}
	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
	/**
	 * Close the drawer
	 */
	closeDrawer(): Promise<MatDrawerToggleResult> {
		return this._userOperationsComponent.matDrawer.close();
	}
}
