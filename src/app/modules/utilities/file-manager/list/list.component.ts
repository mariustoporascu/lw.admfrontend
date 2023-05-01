import {
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
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FileManagerService } from '../../../../core/filemanager/file-manager.service';
import { Item, Items } from '../../../../core/filemanager/file-manager.types';
import { FileManagerComponent } from '../file-manager.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
	selector: 'file-manager-list',
	templateUrl: './list.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerListComponent implements OnInit, OnDestroy {
	@ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
	@ViewChild('videoElement', { static: false }) videoElement: ElementRef;
	@ViewChild('cameraDialog', { static: true }) cameraDialog: any;

	acceptedFileTypes: string[] = ['.jpg', '.jpeg', '.png', '.pdf'];
	drawerMode: 'side' | 'over';
	selectedItem: Item;
	items: Items;
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
		private _fileManagerComponent: FileManagerComponent,
		private _router: Router,
		private _fileManagerService: FileManagerService,
		private _fuseMediaWatcherService: FuseMediaWatcherService,
		private dialog: MatDialog
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
		// Get the items
		this._fileManagerService.Items$.pipe(
			takeUntil(this._unsubscribeAll)
		).subscribe((items: Items) => {
			this.items = items;
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

	/**
	 * Track by function for ngFor loops
	 *
	 * @param index
	 * @param item
	 */
	trackByFn(index: number, item: any): any {
		return item.id || index;
	}
	checkIfFolder(): void {
		this.isFolderPath = this._activatedRoute.snapshot.url.length > 0;
	}

	onFileSelected(event: Event): void {
		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				console.log(files[i].type);
				if (
					this.acceptedFileTypes.indexOf(`.${files[i].type.split('/')[1]}`) === -1
				)
					continue;
				formData.append(`file${i}`, files[i]);
			}
			formData.append('firmaDiscountId', this.firmaDiscountId);
			this._fileManagerService
				.uploadFiles(formData)
				.pipe(catchError((err) => of(err.error)))
				.subscribe((res) => {
					console.log(res);
				});
		}
	}

	async openCamera(): Promise<void> {
		this.dialog.open(this.cameraDialog);

		try {
			const constraints = { video: { facingMode: 'user' }, audio: false };
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			this.videoElement.nativeElement.srcObject = stream;
			this.videoElement.nativeElement.play();
		} catch (err) {
			console.error('Error opening camera:', err);
		}
	}

	closeCamera(): void {
		const stream = this.videoElement.nativeElement.srcObject;
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
		}
		this.dialog.closeAll();
	}

	public captureImage(): void {
		// Create a temporary canvas element
		const canvas = document.createElement('canvas');
		canvas.width = 540;
		canvas.height = 960;
		const ctx = canvas.getContext('2d');

		// Draw the image from the video element to the canvas
		ctx.drawImage(this.videoElement.nativeElement, 0, 0, 540, 960);
		canvas.toBlob((blob) => {
			console.log('Captured image:', blob);
			const formData = new FormData();

			formData.append(`file`, blob, 'image.jpg');
			formData.append('firmaDiscountId', this.firmaDiscountId);
			this._fileManagerService
				.uploadFiles(formData)
				.pipe(catchError((err) => of(err.error)))
				.subscribe((res) => {
					console.log(res);
				});
		}, 'image/jpg');
	}
}
