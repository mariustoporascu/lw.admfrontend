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
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtilsService } from '@fuse/services/utils';
import { Documente, FirmaDiscount } from 'app/core/bkendmodels/models.types';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';

@Component({
	selector: 'master-documente-preapp',
	templateUrl: './master-documente-preapp.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterDocsPreAppComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;
	@ViewChild('confirmDialogView', { static: true }) confirmDialogView: any;

	items: Documente[];
	firme: FirmaDiscount[];

	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'firmaInfo',
		'extractedBusinessData',
		'uploaded',
		'total',
		'discountValue',
		'userEmail',
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
			data: Documente,
			filter: string
		) => {
			let firmaStr = JSON.stringify(
				this.firme.find((item) => item.id === data.firmaDiscountId)
			).toLowerCase();
			let dataStr = JSON.stringify(data).toLowerCase() + firmaStr;
			return dataStr.includes(filter);
		};
		// Get the data
		this._masterFunctDataService.preApprovalDocsData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				// Store the table data
				this.recentTransactionsDataSource.data = data;
				this.items = data;
			});
		this._masterFunctDataService.firmeData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				this.firme = data;
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
				case 'firmaInfo':
					return this.getDetaliiFirmaDiscount(item.firmaDiscountId);
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
	rejectRow(row: Documente) {
		this.sendRequestToServer(row.id, 2);
	}
	approveRow(row: Documente) {
		this.sendRequestToServer(row.id, 3);
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
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	sendRequestToServer(documentId: string, status: number) {
		// Hide the alert
		this.showAlert = false;
		this.disabled = true;
		this._masterFunctDataService
			.updateDocStatus(documentId, status)
			.subscribe({
				next: () => {
					this.alert = {
						type: 'success',
						message: 'Operatiunea a fost efectuata cu succes.',
					};
				},
				error: (err) => {
					if (err.error) {
						// Set the alert
						this.alert = {
							type: 'error',
							message: `Operatiunea a esuat, te rugam sa incerci din nou.`,
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
				this._masterFunctDataService
					.getPreApprovalDocuments()
					.subscribe()
					.add(() => {
						this._router.navigate(['./'], { relativeTo: this._activatedRoute });
						this.showAlert = true;
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
	openDialog(row?: Documente) {
		this.dialogRow = row;
		this._dialog.open(this.confirmDialogView, {
			disableClose: true,
		});
	}
	dialogRow: Documente;
	confirmDialog() {
		this.rejectRow(this.dialogRow);
	}
	getDetaliiFirmaDiscount(firmaDiscountId: string) {
		return this._utilsService.getDetaliiFirmaDiscount(
			this.firme.find((item) => item.id === firmaDiscountId)
		);
	}
}
