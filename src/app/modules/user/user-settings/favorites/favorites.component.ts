import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseUtilsService } from '@fuse/services/utils';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';

@Component({
	selector: 'settings-favorites',
	templateUrl: './favorites.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFavoritesComponent implements OnInit {
	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	disabled: boolean = false;
	searchControl: UntypedFormControl = new UntypedFormControl();
	debounce: number = 200;
	minLength: number = 3;
	resultSets: any[];
	favoritesResultSets: any[];
	/**
	 * Constructor
	 */
	constructor(
		private _userFunctDataService: UserFunctDataService,
		private _cdr: ChangeDetectorRef,
		private _utilsService: FuseUtilsService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the UserFavoritesList
		this._userFunctDataService.getFavoriteList().subscribe((favResultSets) => {
			this.favoritesResultSets = favResultSets;
			this._cdr.markForCheck();
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
	addNewFavorite(conexId: string) {
		this.disabled = true;
		this._userFunctDataService
			.addFavorite(conexId)
			.subscribe({
				next: (result) => {
					this._utilsService.logger('Favorite added', result);
				},
				error: (err) => {
					this._utilsService.logger('Favorite add failed', err);
				},
			})
			.add(() => {
				// Get the UserFavoritesList
				this._userFunctDataService
					.getFavoriteList()
					.subscribe((favResultSets) => {
						this.favoritesResultSets = favResultSets;
					})
					.add(() => {
						this.disabled = false;
						this._cdr.markForCheck();
					});
				const formValue = this.searchControl.value;
				if (!formValue || formValue.length < this.minLength) {
					this.resultSets = null;
				} else {
					this._userFunctDataService
						.queryUsers(formValue)
						.subscribe((resultSets) => {
							this.resultSets = resultSets;
						})
						.add(() => {
							this._cdr.markForCheck();
						});
				}
			});
	}
	deleteFavorite(conexId: string) {
		this.disabled = true;
		this._userFunctDataService
			.removeFavorite(conexId)
			.subscribe({
				next: (result) => {
					this._utilsService.logger('Favorite deleted', result);
				},
				error: (err) => {
					this._utilsService.logger('Favorite delete failed', err);
				},
			})
			.add(() => {
				// Get the UserFavoritesList
				this._userFunctDataService
					.getFavoriteList()
					.subscribe((favResultSets) => {
						this.favoritesResultSets = favResultSets;
					})
					.add(() => {
						this.disabled = false;
						this._cdr.markForCheck();
					});
			});
	}
}
