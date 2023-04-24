import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Input,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { UserOperationsComponent } from '../user-operations.component';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'search-user',
	templateUrl: './search-user.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForUserComponent implements OnInit, OnDestroy {
	searchControl: UntypedFormControl = new UntypedFormControl();
	@Input() debounce: number = 200;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@Input() minLength: number = 5;
	resultSets: any[];

	/**
	 * Constructor
	 */
	constructor(
		private _userOperationsComponent: UserOperationsComponent,
		private _userFunctDataService: UserFunctDataService,
		private _router: Router,
		private _activatedRoute: ActivatedRoute
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
			});
	}

	/**
	 * Setter for bar search input
	 *
	 * @param value
	 */
	@ViewChild('EmailOrPhone')
	set EmailOrPhone(value: ElementRef) {
		// If the value exists, it means that the search input
		// is now in the DOM, and we can focus on the input..
		if (value) {
			// Give Angular time to complete the change detection cycle
			setTimeout(() => {
				// Focus to the input element
				value.nativeElement.focus();
			});
		}
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
	selectAndTransfer(conexId: string) {
		this._userOperationsComponent.sendRequestToServer(
			this._userOperationsComponent.transferIds,
			1,
			conexId
		);
		this.closeDrawer();
		this._router.navigate(['../'], {
			relativeTo: this._activatedRoute,
		});
	}
}
