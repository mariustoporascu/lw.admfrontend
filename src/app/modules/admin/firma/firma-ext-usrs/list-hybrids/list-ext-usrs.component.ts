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
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Documente, Hybrid } from 'app/core/bkendmodels/models.types';
import { FuseUtilsService } from '@fuse/services/utils';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertType } from '@fuse/components/alert';
import { FirmaFunctDataService } from 'app/core/firma-funct-data/firma-funct-data.service';

@Component({
	selector: 'list-ext-usrs',
	templateUrl: './list-ext-usrs.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListExtUsersComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;
	@ViewChild('confirmDialogView', { static: true }) confirmDialogView: any;

	items: Hybrid[];
	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'select',
		'name',
		'noSubAccounts',
		'noDocsUploaded',
		'actions',
	];
	selection = new SelectionModel<Hybrid>(true, []);

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _firmaFunctDataService: FirmaFunctDataService,
		private _cdr: ChangeDetectorRef,
		private _dialog: MatDialog
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.recentTransactionsDataSource.filterPredicate = (
			data: Hybrid,
			filter: string
		) => {
			let dataStr = JSON.stringify(data).toLowerCase();
			return dataStr.includes(filter);
		};
		// Get the data
		this._firmaFunctDataService.externalUsrsData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				// Store the table data
				this.recentTransactionsDataSource.data = data;
				this.items = data;
			});
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		// Make the data source sortable
		this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
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

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
		this.selection.clear();
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
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
	checkboxLabel(row?: Hybrid): string {
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

	deleteSelected() {
		this.sendRequestToServer([...this.selection.selected.map((item) => item.id)]);
		this.selection.clear();
	}
	// transfer guid
	deleteRow(row: Hybrid) {
		this.sendRequestToServer([row.id]);
	}

	sendRequestToServer(groupsIds: string[]) {
		// Hide the alert
		this.showAlert = false;
		this._cdr.markForCheck();
		this._firmaFunctDataService
			.deleteExternalGroups({
				groupsIds,
			})
			.pipe(
				catchError((error: any) => of(error.error)),
				switchMap((response: any) => {
					// Show the alert
					this.showAlert = true;
					this._firmaFunctDataService.getExternalUsers().subscribe(() => {
						this._cdr.markForCheck();
					});

					if (response.error) {
						const error = response.message;
						// Set the alert
						this.alert = {
							type: 'error',
							message: `${error.succes} operatiuni cu succes, ${error.failed} esuate.`,
						};
						return of(false);
					} else {
						this.alert = {
							type: 'success',
							message: 'Operatiunea a fost efectuata cu succes.',
						};
						return of(true);
					}
				})
			)
			.subscribe();
	}
	closeDialog() {
		this._dialog.closeAll();
	}
	openDialog(row?: Hybrid) {
		this.dialogRow = row;
		this._dialog.open(this.confirmDialogView);
	}
	dialogRow: Hybrid;
	confirmDialog() {
		if (this.dialogRow) {
			this.deleteRow(this.dialogRow);
		} else {
			this.deleteSelected();
		}
		this._dialog.closeAll();
	}
}
