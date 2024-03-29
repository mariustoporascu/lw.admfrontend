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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtilsService } from '@fuse/services/utils';
import { Documente } from 'app/core/bkendmodels/models.types';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { FirmaFunctDataService } from 'app/core/firma-funct-data/firma-funct-data.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'firma-docsWFP',
	templateUrl: './firma-docsWFP.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirmaDocsWFPComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;
	@ViewChild('confirmDialogView', { static: true }) confirmDialogView: any;

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
		'userEmail',
		'actions',
	];
	selection = new SelectionModel<Documente>(true, []);
	userCheckboxChecked: boolean = false;
	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	disabled = false;
	transferIds: string[] = [];

	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	drawerMode: 'side' | 'over';

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService,
		private _firmaFunctDataService: FirmaFunctDataService,
		private _cdr: ChangeDetectorRef,
		private _router: Router,
		private _dialog: MatDialog,
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
		// Get the data
		this._firmaFunctDataService.docsData$
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
				case 'userEmail':
					return item.conexiuniConturi?.profilCont?.email ?? '';
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
	toggleUserCheckbox() {
		this.userCheckboxChecked = !this.userCheckboxChecked;
		if (this.userCheckboxChecked) {
			this.recentTransactionsDataSource.data = this.items.filter((item) => {
				return item.conexiuniConturi?.hybridId;
			});
		} else {
			this.recentTransactionsDataSource.data = this.items;
		}
		this.selection.clear();
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
		this.selection.clear();
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
		const numRows = this.recentTransactionsDataSource.data.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.recentTransactionsDataSource.filteredData);
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

	rejectSelected() {
		this.sendRequestToServer(
			[...this.selection.selected.map((item) => item.id)],
			2
		);
	}
	approveSelected() {
		this.sendRequestToServer(
			[...this.selection.selected.map((item) => item.id)],
			1
		);
	}
	// transfer guid
	rejectRow(row: Documente) {
		this.sendRequestToServer([row.id], 2);
	}
	approveRow(row: Documente) {
		this.sendRequestToServer([row.id], 1);
	}
	countTotal() {
		let total = 0;
		this.selection.selected.forEach((item: any) => {
			total += item.discountValue;
		});
		return total.toFixed(2);
	}
	datePicked(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
		let startDate = new Date(dateRangeStart.value).getTime();
		let tempEndDate = new Date(dateRangeEnd.value);
		tempEndDate.setHours(23, 59, 59, 999);
		let endDate = tempEndDate.getTime();
		this.recentTransactionsDataSource.data = this.items.filter((item) => {
			if (this.userCheckboxChecked && !item.conexiuniConturi?.hybridId) {
				return false;
			}
			var currDate = new Date(item.uploaded).getTime();
			return currDate >= startDate && currDate <= endDate;
		});
		this.selection.clear();
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	sendRequestToServer(documenteIds: string[], status: number) {
		// Hide the alert
		this.showAlert = false;
		this.disabled = true;
		this._firmaFunctDataService
			.updateDocStatus({
				documenteIds,
				status,
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
				this._firmaFunctDataService
					.getDocumentsWFP()
					.subscribe()
					.add(() => {
						this.showAlert = true;
						this.disabled = false;
						if (this.dialogRow) {
							this.dialogRow = null;
						} else {
							this.selection.clear();
						}
						this.closeDialog();
						this._cdr.markForCheck();
					});
			});
	}
	closeDialog() {
		this._dialog.closeAll();
	}
	openDialog(row?: Documente) {
		this.dialogRow = row;
		this._dialog.open(this.confirmDialogView, {
			disableClose: true,
		});
	}
	dialogRow: Documente;
	confirmDialog() {
		if (this.dialogRow) {
			this.rejectRow(this.dialogRow);
		} else {
			this.rejectSelected();
		}
	}
}
