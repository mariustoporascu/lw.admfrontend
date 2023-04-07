import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FileManagerService } from '../../../../core/filemanager/file-manager.service';
import { Item } from '../../../../core/filemanager/file-manager.types';
import { FileManagerListComponent } from '../list/list.component';
import { ActivatedRoute } from '@angular/router';
import { FileManagerComponent } from '../file-manager.component';

@Component({
	selector: 'file-manager-details',
	templateUrl: './details.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
	item: Item;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	baseRoute: string = 'filemanager';
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		private _fileManagerListComponent: FileManagerListComponent,
		private _fileManagerComponent: FileManagerComponent,
		private _fileManagerService: FileManagerService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this.baseRoute = this._fileManagerComponent.baseRoute;

		// Open the drawer
		this._fileManagerListComponent.matDrawer.open();
		console.log(this._activatedRoute.snapshot.params.id);
		// Get the item
		this._fileManagerService.Item$.pipe(
			takeUntil(this._unsubscribeAll)
		).subscribe((item: Item) => {
			// Open the drawer in case it is closed
			this._fileManagerListComponent.matDrawer.open();

			// Get the item
			this.item = item;

			// Mark for check
			this._changeDetectorRef.markForCheck();
		});
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
	 * Close the drawer
	 */
	closeDrawer(): Promise<MatDrawerToggleResult> {
		return this._fileManagerListComponent.matDrawer.close();
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
}