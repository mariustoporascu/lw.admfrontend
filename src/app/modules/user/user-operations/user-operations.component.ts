import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtilsService } from '@fuse/services/utils';

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

	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'docNumber',
		'extractedBusinessData',
		'uploaded',
		'total',
		'discountValue',
		'statusName',
	];
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _userFunctDataService: UserFunctDataService,
		private _utilsService: FuseUtilsService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the data
		this._userFunctDataService.operatiuniData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				// Store the table data
				this.recentTransactionsDataSource.data = data;
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
		return new Date().toLocaleDateString();
	}

	getCurrentMonth() {
		return new Date().toLocaleString('default', { month: 'long' });
	}

	getLastMonth() {
		return new Date(
			new Date().setMonth(new Date().getMonth() - 1)
		).toLocaleString('default', { month: 'long' });
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
}
