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
import { ChartData } from 'chart.js';
import { FuseUtilsService } from '@fuse/services/utils';
import { FirmaFunctDataService } from 'app/core/firma-funct-data/firma-funct-data.service';

@Component({
	selector: 'firma-dashboard',
	templateUrl: './firma-dash.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirmaDashComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild('recentTransactionsTable', { read: MatSort })
	recentTransactionsTableMatSort: MatSort;

	// Chart data
	barChartData: ChartData<'bar'> = {
		labels: [],
		datasets: [
			{
				data: [],
				label: 'Statistica puncte acordate',
				backgroundColor: '#94ff97',
				borderColor: '#519154',
			},
		],
	};

	// History data
	currMonthHistory: any;
	lastMonthHistory: any;

	// Table data
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
		private _firmaFunctDataService: FirmaFunctDataService,
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
		this._firmaFunctDataService.dashboardData$
			.pipe(takeUntil(this._unsubscribeAll))
			.subscribe((data) => {
				this.currMonthHistory = {
					docs: data.lastTwoMths.countDocUpThisMth,
					rejected: data.lastTwoMths.countPtsRejThisMth,
					approved: data.lastTwoMths.countPtsAprThisMonth,
				};
				this.lastMonthHistory = {
					docs: data.lastTwoMths.countDocUpLastMth,
					rejected: data.lastTwoMths.countPtsRejLastMth,
					approved: data.lastTwoMths.countPtsAprLastMonth,
				};
				(data.monthlyAnalitics as any[]).forEach((item) => {
					this.barChartData.labels.push(item.label);
					this.barChartData.datasets[0].data.push(item.value);
				});
				// Store the table data
				this.recentTransactionsDataSource.data = data.latestDocs;
			});
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {
		// Make the data source sortable
		this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
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
	splitByCapitalLetters(str: string): string {
		return this._utilsService.splitByCapitalLetters(str);
	}
}
