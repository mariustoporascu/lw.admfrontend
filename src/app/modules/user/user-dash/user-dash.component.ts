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
import { ApexOptions } from 'ng-apexcharts';
import { UserFunctDataService } from 'app/core/user-funct-data/user-funct-data.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
	selector: 'user-dashboard',
	templateUrl: './user-dash.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;
	@ViewChild('recentTransactionsTablePagination')
	recentTransactionsTablePagination: MatPaginator;

	data: any;
	accountBalanceOptions: ApexOptions;
	recentTransactionsDataSource: MatTableDataSource<any> =
		new MatTableDataSource();
	recentTransactionsTableColumns: string[] = [
		'transactionId',
		'date',
		'name',
		'amount',
		'status',
	];
	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(private _userFunctDataService: UserFunctDataService) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the data
		this._userFunctDataService.data$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				// Store the data
				this.data = data;

				// Store the table data
				this.recentTransactionsDataSource.data = data.recentTransactions;

				// Prepare the chart data
				this._prepareChartData();
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

	/**
	 * Prepare the chart data from the data
	 *
	 * @private
	 */
	private _prepareChartData(): void {
		// Account balance
		this.accountBalanceOptions = {
			chart: {
				animations: {
					speed: 400,
					animateGradually: {
						enabled: false,
					},
				},
				fontFamily: 'inherit',
				foreColor: 'inherit',
				width: '100%',
				height: '100%',
				type: 'area',
				sparkline: {
					enabled: true,
				},
			},
			colors: ['#A3BFFA', '#667EEA'],
			fill: {
				colors: ['#CED9FB', '#AECDFD'],
				opacity: 0.5,
				type: 'solid',
			},
			series: this.data.accountBalance.series,
			stroke: {
				curve: 'straight',
				width: 2,
			},
			tooltip: {
				followCursor: true,
				theme: 'dark',
				x: {
					format: 'MMM dd, yyyy',
				},
				y: {
					formatter: (value): string => value + '%',
				},
			},
			xaxis: {
				type: 'datetime',
			},
		};
	}

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
}
