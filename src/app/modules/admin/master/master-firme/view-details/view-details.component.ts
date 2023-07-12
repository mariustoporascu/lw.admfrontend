import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Documente, FirmaDiscount } from 'app/core/bkendmodels/models.types';
import { FuseUtilsService } from '@fuse/services/utils';
import { MasterFirmeComponent } from '../master-firme.component';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';

@Component({
	selector: 'view-details',
	templateUrl: './view-details.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDetailsComponent implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	documentId: string;
	document: FirmaDiscount;
	/**
	 * Constructor
	 */
	constructor(
		private _masterFirmeComponent: MasterFirmeComponent,
		private _masterFunctDataService: MasterFunctDataService,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this._activatedRoute.paramMap.subscribe((params) => {
			this.documentId = params.get('id');
			this._masterFunctDataService.firmaExtendedData$
				.pipe(takeUntil(this._unsubscribeAll))
				.subscribe((data) => {
					this._masterFirmeComponent.matDrawer.open();
					this.document = data;
					this._cdr.markForCheck();
				});
		});
	}
	getDate(date: string): string {
		return this._utilsService.parseDate(date);
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		// Unsubscribe from all subscriptions
		this._unsubscribeAll.next(null);
		this._unsubscribeAll.complete();
	}
	/**
	 * Close the drawer
	 */
	closeDrawer(): Promise<MatDrawerToggleResult> {
		return this._masterFirmeComponent.matDrawer.close();
	}
}
