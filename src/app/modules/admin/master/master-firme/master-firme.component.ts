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
import { FirmaDiscount } from 'app/core/bkendmodels/models.types';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';

@Component({
	selector: 'master-firme',
	templateUrl: './master-firme.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterFirmeComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;
	@ViewChild('confirmDialogView', { static: true }) confirmDialogView: any;

	items: FirmaDiscount[];
	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'name',
		'cuiNumber',
		'discountPercent',
		'mainContactName',
		'mainContactEmail',
		'mainContactPhone',
		'isActive',
		'isActiveSecondary',
		'actions',
	];

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	disabled: boolean = false;
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	drawerMode: 'side' | 'over';
	textQuestion: string = 'Esti sigur ca vrei sa dezactivezi contractul firmei?';
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService,
		private _masterFunctDataService: MasterFunctDataService,
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
			data: FirmaDiscount,
			filter: string
		) => {
			let dataStr = JSON.stringify(data).toLowerCase();
			return dataStr.includes(filter);
		};
		// Get the data
		this._masterFunctDataService.firmeData$
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
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	splitByCapitalLetters(str: string): string {
		return this._utilsService.splitByCapitalLetters(str);
	}

	// transfer guid
	rejectRow(row: FirmaDiscount, isSecondary: boolean = false) {
		this.sendRequestToServer(row.id, isSecondary);
	}
	approveRow(row: FirmaDiscount, isSecondary: boolean = false) {
		this.sendRequestToServer(row.id, isSecondary);
	}

	sendRequestToServer(firmaId: string, isSecondary: boolean) {
		// Hide the alert
		this.showAlert = false;
		this.disabled = true;
		this._utilsService.logger('firmaId', firmaId);
		this._masterFunctDataService
			.updateFirmaStatus(firmaId, isSecondary)
			.subscribe({
				next: (data) => {
					this._utilsService.logger('updateFirmaStatus', data);
					this.alert = {
						type: 'success',
						message: 'Statusul firmei a fost modificat cu succes',
					};
					this.showAlert = true;
				},
				error: (err) => {
					this._utilsService.logger('updateFirmaStatus', err);
					this.alert = {
						type: 'error',
						message: 'A intervenit o eroare la modificarea statusului firmei',
					};
					this.showAlert = true;
				},
			})
			.add(() => {
				this._masterFunctDataService
					.getAllFirme()
					.subscribe()
					.add(() => {
						this.disabled = false;
						if (this.dialogRow) {
							this.dialogRow = null;
							this.closeDialog();
						}
						this._cdr.markForCheck();
					});
			});
	}
	closeDialog() {
		this._dialog.closeAll();
	}
	openDialog(row?: FirmaDiscount, isSecondary: boolean = false) {
		this.dialogRow = row;
		this.isSecondary = isSecondary;
		if (this.isSecondary) {
			this.textQuestion = 'Esti sigur ca vrei sa dezactivezi pentru useri?';
		} else {
			this.textQuestion = 'Esti sigur ca vrei sa dezactivezi contractul firmei?';
		}
		this._dialog.open(this.confirmDialogView, {
			disableClose: true,
		});
	}
	dialogRow: FirmaDiscount;
	isSecondary: boolean = false;
	confirmDialog() {
		this.rejectRow(this.dialogRow, this.isSecondary);
	}
}
