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
import { ActivatedRoute, Router } from '@angular/router';
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
	disabled: boolean = false;
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	baseRoute: string = 'filemanager';
	documentId: string;
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
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
			this._cdr.markForCheck();
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
	getDate(date: string): string {
		return this._utilsService.parseDate(date);
	}
	async openCamera(): Promise<void> {
		this.dialog.open(this.cameraDialog, { disableClose: true });

		try {
			const constraints = { video: { facingMode: 'environment' }, audio: false };
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			this.videoElement.nativeElement.srcObject = stream;
			this.videoElement.nativeElement.play();
		} catch (err) {
			this._utilsService.logger('Error opening camera:', err);
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
				this.disabled = true;
				this.showAlert = false;
				this.alert = {
					type: 'success',
					message: '',
				};
			});
			this._fileManagerService
				.rescanCode(formData)
				.subscribe({
					next: (response) => {
						this._ngZone.run(() => {
							this.alert = {
								type: 'success',
								message: 'Codul a fost extras cu succes din imagine.',
							};
							this._fileManagerListComponent.refreshData();
							this._router.navigate(['../../'], {
								relativeTo: this._activatedRoute,
							});
							setTimeout(() => {
								this.closeCamera();
							}, 1000);
						});
					},
					error: (err) => {
						this._ngZone.run(() => {
							if (err.error) {
								this.alert = {
									type: 'error',
									message: 'Codul nu a putut fi extras din imagine, mai incearca.',
								};
							} else {
								this.alert = {
									type: 'warning',
									message: 'Eroare pe server. Echipa tehnica a fost notificata.',
								};
							}
						});
					},
				})
				.add(() => {
					this._ngZone.run(() => {
						this.disabled = false;
						this.showAlert = true;
						this._cdr.markForCheck();
					});
				});
		}, 'image/png');
	}

	deleteFile(): void {
		this._fileManagerListComponent.showAlert = false;
		this.disabled = true;
		this._fileManagerListComponent.componentMarkForCheck();
		this._fileManagerService
			.deleteFile(this.item.fileInfo.fisiereDocumente.id, this.documentId)
			.subscribe({
				next: (response) => {
					this._utilsService.logger('document delete success', response);
					this._fileManagerListComponent.showAlert = true;
					// Set the alert
					this._fileManagerListComponent.alert = {
						type: 'success',
						message: `Documentul a fost sters.`,
					};
				},
				error: (err) => {
					this._utilsService.logger('document delete error', err);
					this._fileManagerListComponent.showAlert = true;
					// Set the alert
					this._fileManagerListComponent.alert = {
						type: 'error',
						message: `Stergerea documentului a intampinat o eroare, echipa tehnica a fost notificata.`,
					};
				},
			})
			.add(() => {
				this._fileManagerListComponent.refreshData();
				this.disabled = false;
				this._cdr.markForCheck();
			});
	}
	downloadFile(): void {
		this._fileManagerListComponent.showAlert = false;
		this.disabled = true;
		this._fileManagerService
			.downloadFile(this.item.fileInfo.fisiereDocumente.identifier)
			.subscribe({
				next: (fileStream: ArrayBuffer) => {
					if (!fileStream) {
						this._fileManagerListComponent.showAlert = true;
						// Set the alert
						this._fileManagerListComponent.alert = {
							type: 'error',
							message: `Fisierul nu a putut fi descarcat.`,
						};
						return;
					}

					const blob = new Blob([fileStream]);
					const url = window.URL.createObjectURL(blob);
					const link = document.createElement('a');
					link.href = url;
					link.download = this.item.fileInfo.fisiereDocumente.fileName + '.pdf'; // provide the filename here
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				},
				error: (error) => {
					// Handle any other errors here.
					this._utilsService.logger(
						'An error occurred while downloading the file',
						error
					);
					this._fileManagerListComponent.showAlert = true;
					// Set the alert
					this._fileManagerListComponent.alert = {
						type: 'warning',
						message: `Eroare pe server. Echipa tehnica a fost notificata.`,
					};
				},
			})
			.add(() => {
				this.disabled = false;
				this._cdr.markForCheck();
			});
	}
}
