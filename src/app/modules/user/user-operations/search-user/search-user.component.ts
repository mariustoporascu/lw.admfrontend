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
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Subject, debounceTime, filter, map, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseUtilsService } from '@fuse/services/utils';

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
	selectedForFavorite: boolean = false;
	favoritesResultSets: any[];

	/**
	 * Constructor
	 */
	constructor(
		private _userOperationsComponent: UserOperationsComponent,
		private _userFunctDataService: UserFunctDataService,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this._userOperationsComponent.matDrawer.open();
		// Get the UserFavoritesList
		this._userFunctDataService.getFavoriteList().subscribe((favResultSets) => {
			this.favoritesResultSets = favResultSets;
			this._cdr.markForCheck();
		});
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
		if (event.code.includes('Enter')) {
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
	selectAndTransfer(conexId: string, isFromFavorite: boolean = false) {
		this._userOperationsComponent.sendRequestToServer(
			this._userOperationsComponent.transferIds,
			1,
			conexId
		);
		if (this.selectedForFavorite && !isFromFavorite) {
			this._userFunctDataService.addFavorite(conexId).subscribe({
				next: (result) => {
					this._utilsService.logger('addFavorite', result);
				},
				error: (err) => {
					this._utilsService.logger('addFavorite', err);
				},
			});
		}
		this.closeDrawer();
		this._router.navigate(['../'], {
			relativeTo: this._activatedRoute,
		});
	}
	toggleSelectedForFavorite() {
		this.selectedForFavorite = !this.selectedForFavorite;
		this._utilsService.logger('selectedForFavorite', this.selectedForFavorite);
	}
}
