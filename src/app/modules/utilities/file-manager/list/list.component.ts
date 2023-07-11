import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, catchError, filter, of, switchMap, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../../../../core/filemanager/file-manager.service';
import { Item, Items } from '../../../../core/filemanager/file-manager.types';
import { FileManagerComponent } from '../file-manager.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseUtilsService } from '@fuse/services/utils';

@Component({
	selector: 'file-manager-list',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerListComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'docType',
		'fileName',
		'created',
		'status',
	];

	acceptedFileTypes: string[] = ['.jpg', '.jpeg', '.png', '.pdf'];
	drawerMode: 'side' | 'over';
	selectedItem: Item;
	items: Items;
	folders: Item[];
	isFolderPath: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	baseRoute: string = 'filemanager';
	firmaDiscountId: string;
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		private _utilsService: FuseUtilsService,
		private _fileManagerComponent: FileManagerComponent,
		private _router: Router,
		private _fileManagerService: FileManagerService,
		private _fuseMediaWatcherService: FuseMediaWatcherService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.baseRoute = this._fileManagerComponent.baseRoute;
		// Subscribe to the route params
		this._activatedRoute.paramMap.subscribe((params) => {
			this.firmaDiscountId = params.get('folderId');
		});
		this.recentTransactionsDataSource.filterPredicate = (
			data: Item,
			filter: string
		) => {
			let dataStr = JSON.stringify(data).toLowerCase();
			return dataStr.includes(filter);
		};
		// Get the items
		this._fileManagerService.Items$.pipe(
			takeUntil(this._unsubscribeAll)
		).subscribe((items: Items) => {
			this.items = items;
			this.folders = items.folders;
			this.recentTransactionsDataSource.data = items.files;
			// Mark for check
			this._changeDetectorRef.markForCheck();
		});
		// Get the item
		this._fileManagerService.Item$.pipe(
			takeUntil(this._unsubscribeAll)
		).subscribe((item: Item) => {
			this.selectedItem = item;

			// Mark for check
			this._changeDetectorRef.markForCheck();
		});

		// Subscribe to media query change
		this._fuseMediaWatcherService
			.onMediaQueryChange$('(min-width: 1440px)')
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((state) => {
				// Calculate the drawer mode
				this.drawerMode = state.matches ? 'side' : 'over';

				// Mark for check
				this._changeDetectorRef.markForCheck();
			});
		this.checkIfFolder();
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
	 * On backdrop clicked
	 */
	onBackdropClicked(): void {
		// Go back to the list
		this._router.navigate(['./'], { relativeTo: this._activatedRoute });

		// Mark for check
		this._changeDetectorRef.markForCheck();
	}
	refreshData() {
		this.showAlert = false;
		this._fileManagerService.getFiles().subscribe((res) => {
			this._fileManagerService.setItems(this.firmaDiscountId);
			this._changeDetectorRef.markForCheck();
		});
	}
	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}
	customSort(sort: Sort) {
		this._utilsService.logger('sort', sort.active, sort.direction, sort);
		if (sort.direction === '') {
			this.recentTransactionsDataSource.data =
				this.recentTransactionsDataSource.data.sort((a, b) =>
					this._utilsService.sortFunction(
						a.fileInfo.fisiereDocumente.created,
						b.fileInfo.fisiereDocumente.created,
						'desc'
					)
				);
			return;
		}
		const data = this.recentTransactionsDataSource.data.slice(); // Make a copy of the data array
		const sortedData = data.sort((a, b) => {
			if (sort.active === 'docType') {
				return this._utilsService.sortFunction(
					a.fileInfo.isInvoice,
					b.fileInfo.isInvoice,
					sort.direction
				);
			} else if (sort.active === 'fileName') {
				return this._utilsService.sortFunction(
					a.fileInfo.fisiereDocumente.fileName ?? '',
					b.fileInfo.fisiereDocumente.fileName ?? '',
					sort.direction
				);
			} else if (sort.active === 'created') {
				return this._utilsService.sortFunction(
					a.fileInfo.fisiereDocumente.created ?? '',
					b.fileInfo.fisiereDocumente.created ?? '',
					sort.direction
				);
			} else if (sort.active === 'status') {
				// sort by int value
				return sort.direction === 'asc'
					? a.fileInfo.status - b.fileInfo.status
					: b.fileInfo.status - a.fileInfo.status;
			}
		});
		this.recentTransactionsDataSource.data = sortedData;
	}
	datePicked(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
		let startDate = new Date(dateRangeStart.value).getTime();
		let tempEndDate = new Date(dateRangeEnd.value);
		tempEndDate.setHours(23, 59, 59, 999);
		let endDate = tempEndDate.getTime();
		this.recentTransactionsDataSource.data = this.items.files.filter((item) => {
			var currDate = new Date(item.fileInfo.fisiereDocumente.created).getTime();
			return currDate >= startDate && currDate <= endDate;
		});
		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}

	checkIfFolder(): void {
		this.isFolderPath = this._activatedRoute.snapshot.url.length > 0;
	}

	onFileSelected(event: Event): void {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				if (
					this.acceptedFileTypes.indexOf(`.${files[i].type.split('/')[1]}`) === -1
				)
					continue;
				formData.append(`file${i}`, files[i]);
			}
			formData.append('firmaDiscountId', this.firmaDiscountId);
			// Hide the alert
			this.showAlert = false;
			this._fileManagerService
				.uploadFiles(formData)

				.subscribe({
					next: (response) => {
						this.alert = {
							type: 'success',
							message: 'Incarcarea a fost efectuata cu succes.',
						};
					},
					error: (err) => {
						if (err.error) {
							const error = err.message;
							// Set the alert
							this.alert = {
								type: 'error',
								message: `${error.succes} incarcari cu succes, ${error.failed} esuate.`,
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
					(event.target as HTMLInputElement).value = '';
					this._fileManagerService
						.getFiles()
						.subscribe()
						.add(() => {
							this.showAlert = true;
							this._fileManagerService.setItems(this.firmaDiscountId);
							this._changeDetectorRef.markForCheck();
						});
				});
		}
	}
	splitByCapitalLetters(str: string): string {
		return this._utilsService.splitByCapitalLetters(str);
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.recentTransactionsDataSource.filter = filterValue.trim().toLowerCase();

		if (this.recentTransactionsDataSource.paginator) {
			this.recentTransactionsDataSource.paginator.firstPage();
		}
	}
	applyFolderFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.folders = this.items.folders.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(filterValue.trim().toLowerCase())
		);
	}
}
