import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
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
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { HybridFunctDataService } from 'app/core/hybrid-funct-data/hybrid-funct-data.service';

@Component({
	selector: 'search-user',
	templateUrl: './search-user.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchForUserComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	searchControl: UntypedFormControl = new UntypedFormControl();
	@Input() debounce: number = 200;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	@Input() minLength: number = 3;
	resultSets: any[];

	/**
	 * Constructor
	 */
	constructor(
		private _userOperationsComponent: UserOperationsComponent,
		private _userFunctDataService: HybridFunctDataService,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
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
	}

	ngAfterViewInit(): void {
		if (
			!this._userOperationsComponent.transferIds ||
			this._userOperationsComponent.transferIds.length == 0
		) {
			this._router.navigate(['../'], {
				relativeTo: this._activatedRoute,
			});
		}
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
	 * On keydown of the search input
	 *
	 * @param event
	 */
	onKeydown(event: KeyboardEvent): void {
		// Escape
		if (event.code === 'Enter') {
			// Subscribe to the search field value changes
			const formValue = this.searchControl.value;
			if (!formValue || formValue.length < this.minLength) {
				this.resultSets = null;
				return;
			}
			this._userFunctDataService.queryUsers(formValue).subscribe((resultSets) => {
				this.resultSets = resultSets;
				this._cdr.markForCheck();
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
