import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, catchError, of, switchMap, takeUntil, tap } from 'rxjs';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtilsService } from '@fuse/services/utils';
import { Documente } from 'app/core/bkendmodels/models.types';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';

@Component({
	selector: 'user-operations',
	templateUrl: './user-operations.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOperationsComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;
	items: Documente[];

	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'select',
		'docNumber',
		'extractedBusinessData',
		'uploaded',
		'total',
		'discountValue',
		'statusName',
		'actions',
	];
	selection = new SelectionModel<Documente>(true, []);

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	disabled: boolean = false;
	transferIds: string[] = [];

	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	drawerMode: 'side' | 'over';
	userType: string;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _userFunctDataService: UserFunctDataService,
		private _utilsService: FuseUtilsService,
		private _cdr: ChangeDetectorRef,
		private _userService: UserService,
		private _router: Router,
		private _fuseMediaWatcherService: FuseMediaWatcherService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.recentTransactionsDataSource.filterPredicate = (
			data: Documente,
			filter: string
		) => {
			let dataStr = JSON.stringify(data).toLowerCase();
			return dataStr.includes(filter);
		};
		// Get the user data
		this._userService.user$.subscribe((user) => {
			// Create the form
			this.userType = user.type;
			this._cdr.markForCheck();
		});
		// Get the data
		this._userFunctDataService.operatiuniData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				// Store the table data
				this.recentTransactionsDataSource.data = data;
				this.items = data;
			});
		// Subscribe to media query change
		this._fuseMediaWatcherService
			.onMediaQueryChange$('(min-width: 1440px)')
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((state) => {
				// Calculate the drawer mode
				this.drawerMode = state.matches ? 'side' : 'over';

				// Mark for check
				this._cdr.markForCheck();
			});
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		// Make the data source sortable
		this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
		this.recentTransactionsDataSource.sortingDataAccessor = (item, property) => {
			switch (property) {
				case 'docNumber':
					return item.ocrData?.docNumber?.value ?? '';
				case 'extractedBusinessData':
					return item.ocrData?.adresaFirma?.value ?? '';
				case 'total':
					return item.ocrData?.total?.value ?? '';
				default:
					return item[property];
			}
		};
		this.recentTransactionsDataSource.paginator =
			this.recentTransactionsTablePagination;
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}
	datePicked(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
		let startDate = new Date(dateRangeStart.value).getTime();
		let tempEndDate = new Date(dateRangeEnd.value);
		tempEndDate.setHours(23, 59, 59, 999);
		let endDate = tempEndDate.getTime();
		this.recentTransactionsDataSource.data = this.items.filter((item) => {
			var currDate = new Date(item.uploaded).getTime();
			return currDate >= startDate && currDate <= endDate;
		});
		this.selection.clear();

		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	// -----------------------------------------------------------------------------------------------------
	// @ Private methods
	// -----------------------------------------------------------------------------------------------------

	getCurrentDate() {
		return this._utilsService.getCurrentDate();
	}

	getCurrentMonth() {
		return this._utilsService.getCurrentMonth();
	}

	getLastMonth() {
		return this._utilsService.getLastMonth();
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
		// this.selection.clear();
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	splitByCapitalLetters(str: string): string {
		return this._utilsService.splitByCapitalLetters(str);
	}
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.recentTransactionsDataSource.data.filter(
			(item) => item.status === 1
		).length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (
			this.isAllSelected() ||
			(this.selection.selected.length > 0 &&
				this.recentTransactionsDataSource.filteredData.length === 0)
		) {
			this.selection.clear();
			return;
		}

		this.selection.select(
			...this.recentTransactionsDataSource.filteredData.filter(
				(item) => item.status === 1
			)
		);
	}

	/** Select by filtering rows with sum of discount value */
	selectByDiscountValue(event: Event) {
		this.selection.clear();
		const filterValue = (event.target as HTMLInputElement).value;
		if (
			filterValue >
			this.recentTransactionsDataSource.data.reduce(
				(acc, item) => acc + item.discountValue,
				0
			)
		) {
			this.selection.select(
				...this.recentTransactionsDataSource.filteredData.filter(
					(item) => item.status === 1
				)
			);
			return;
		}
		this.selection.select(
			...this._utilsService.getOptimalCombination(
				this.recentTransactionsDataSource.data.filter((item) => item.status === 1),
				parseInt(filterValue)
			)
		);
	}
	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: Documente): string {
		if (!row) {
			return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
		}
		return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
			this.recentTransactionsDataSource.data.indexOf(row) + 1
		}`;
	}
	countSelected() {
		return this.selection.selected.length;
	}
	countTotal() {
		let total = 0;
		this.selection.selected.forEach((item: any) => {
			total += item.discountValue;
		});
		return total.toFixed(2);
	}
	// transfer guid 3a242ee5-111b-48e9-8b7d-d7592ddb23ba
	makeTransferSelected() {
		this.transferIds = [...this.selection.selected.map((item) => item.id)];
		this._router.navigate(['./search-user'], {
			relativeTo: this._activatedRoute,
		});
	}
	makeWithdrawalSelected() {
		this.sendRequestToServer(
			[...this.selection.selected.map((item) => item.id)],
			2
		);
	}
	// transfer guid
	makeTransferRow(row: Documente) {
		this.transferIds = [row.id];
		this._router.navigate(['./search-user'], {
			relativeTo: this._activatedRoute,
		});
	}
	makeWithdrawalRow(row: Documente) {
		this.sendRequestToServer([row.id], 2);
	}

	sendRequestToServer(
		documenteIds: string[],
		tranzactionType: number,
		nextConexId?: string
	) {
		// Hide the alert
		this.showAlert = false;
		this.disabled = true;
		this._userFunctDataService
			.addTranzaction({
				documenteIds,
				tranzactionType,
				nextConexId,
			})
			.subscribe({
				next: () => {
					this.alert = {
						type: 'success',
						message: 'Operatiunea a fost efectuata cu succes.',
					};
				},
				error: (err) => {
					if (err.error) {
						const error = err.message;
						// Set the alert
						this.alert = {
							type: 'error',
							message: `${error.succes} operatiuni cu succes, ${error.failed} esuate.`,
						};
					} else {
						this.alert = {
							type: 'warning',
							message: 'Eroare pe server. Echipa tehnica a fost notificata.',
						};
					}
				},
			})
			.add(() => {
				this._userFunctDataService
					.getApprovedDocuments()
					.subscribe()
					.add(() => {
						this.disabled = false;
						this.showAlert = true;
						this.selection.clear();
						this._cdr.markForCheck();
					});
			});
	}

	getDetaliiBusiness(data: any): string {
		return this._utilsService.getDetaliiBusiness(data);
	}
}
