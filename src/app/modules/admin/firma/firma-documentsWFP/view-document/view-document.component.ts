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
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FirmaDocsWFPComponent } from '../firma-docsWFP.component';
import { FileManagerService } from 'app/core/filemanager/file-manager.service';
import { Documente } from 'app/core/bkendmodels/models.types';
import { FuseUtilsService } from '@fuse/services/utils';

@Component({
	selector: 'view-document',
	templateUrl: './view-document.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDocumentComponent implements OnInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	documentId: string;
	document: Documente;
	fileBlob: Blob;
	/**
	 * Constructor
	 */
	constructor(
		private _firmaDocsWFPComponent: FirmaDocsWFPComponent,
		private _fileManagerService: FileManagerService,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService,
		private _ngZone: NgZone
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
			this._ngZone.run(() => {
				this.document = this._firmaDocsWFPComponent.items.find(
					(item) => item.fisiereDocumente.identifier === this.documentId
				);
				this._cdr.markForCheck();
			});
			this._firmaDocsWFPComponent.matDrawer.open();

			this.downloadFile();
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
		return this._firmaDocsWFPComponent.matDrawer.close();
	}
	downloadFile(): void {
		this._fileManagerService.downloadFile(this.documentId).subscribe({
			next: (fileStream: ArrayBuffer) => {
				this._cdr.markForCheck();
				if (!fileStream) {
					return;
				}

				this.fileBlob = new Blob([fileStream]);
				// Mark for check
				this._cdr.markForCheck();
			},
			error: (error) => {
				// Handle any other errors here.
				console.error('An error occurred while downloading the file', error);
			},
		});
	}
}
