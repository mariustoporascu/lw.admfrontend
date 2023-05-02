import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	NgZone,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { FileManagerService } from '../../../../core/filemanager/file-manager.service';
import { Item } from '../../../../core/filemanager/file-manager.types';
import { FileManagerListComponent } from '../list/list.component';
import { ActivatedRoute } from '@angular/router';
import { FileManagerComponent } from '../file-manager.component';
import { FuseUtilsService } from '@fuse/services/utils';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
	selector: 'file-manager-details',
	templateUrl: './details.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerDetailsComponent implements OnInit, OnDestroy {
	item: Item;
	@ViewChild('videoElement', { static: false }) videoElement: ElementRef;
	@ViewChild('cameraDialog', { static: true }) cameraDialog: any;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;

	private _unsubscribeAll: Subject<any> = new Subject<any>();
	baseRoute: string = 'filemanager';
	documentId: string;
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _changeDetectorRef: ChangeDetectorRef,
		private _fileManagerListComponent: FileManagerListComponent,
		private _fileManagerComponent: FileManagerComponent,
		private _fileManagerService: FileManagerService,
		private _utilsService: FuseUtilsService,
		private dialog: MatDialog,
		private _ngZone: NgZone
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
			this.documentId = params.get('id');
		});
		// Open the drawer
		this._fileManagerListComponent.matDrawer.open();
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
	splitByCapitalLetters(str: string): string {
		return this._utilsService.splitByCapitalLetters(str);
	}
	async openCamera(): Promise<void> {
		this.dialog.open(this.cameraDialog);

		try {
			const constraints = { video: { facingMode: 'environment' }, audio: false };
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

	captureImage(): void {
		// Create a temporary canvas element
		const canvas = document.createElement('canvas');
		canvas.width = this.videoElement.nativeElement.videoWidth;
		canvas.height = this.videoElement.nativeElement.videoHeight;
		const ctx = canvas.getContext('2d');

		// Draw the image from the video element to the canvas
		ctx.drawImage(
			this.videoElement.nativeElement,
			0,
			0,
			canvas.width,
			canvas.height
		);
		canvas.toBlob((blob) => {
			const formData = new FormData();

			formData.append(`file`, blob, 'image.png');
			formData.append('documentId', this.documentId);
			this._ngZone.run(() => {
				this.showAlert = false;
				this.alert = {
					type: 'success',
					message: '',
				};
			});
			this._fileManagerService
				.rescanCode(formData)
				.pipe(
					catchError((err) => of(err.error)),
					switchMap((response) => {
						return this._ngZone.run(() => {
							console.log(response);
							// Show the alert
							this.showAlert = true;
							if (response.error) {
								// Set the alert
								this.alert = {
									type: 'error',
									message: 'Codul nu a putut fi extras din imagine, mai incearca.',
								};
								return of(false);
							} else {
								this.alert = {
									type: 'success',
									message: 'Codul a fost extras cu succes din imagine.',
								};
								return of(true);
							}
						});
					})
				)
				.subscribe((resp) => {
					this._changeDetectorRef.markForCheck();
					if (resp) {
						setTimeout(() => {
							this.closeCamera();
						}, 1000);
					}
				});
		}, 'image/png');
	}
}
