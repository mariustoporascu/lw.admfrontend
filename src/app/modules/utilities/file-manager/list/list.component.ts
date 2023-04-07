import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../../../../core/filemanager/file-manager.service';
import { Item, Items } from '../../../../core/filemanager/file-manager.types';
import { FileManagerComponent } from '../file-manager.component';

@Component({
	selector: 'file-manager-list',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerListComponent implements OnInit, OnDestroy {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	drawerMode: 'side' | 'over';
	selectedItem: Item;
	items: Items;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	baseRoute: string = 'filemanager';
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
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
		// Get the items
		this._fileManagerService.Items$.pipe(
			takeUntil(this._unsubscribeAll)
		).subscribe((items: Items) => {
			this.items = items;
			console.log(items);
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
		console.log('onBackdropClicked()');
		this._router.navigate(['./'], { relativeTo: this._activatedRoute });

		// Mark for check
		this._changeDetectorRef.markForCheck();
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
