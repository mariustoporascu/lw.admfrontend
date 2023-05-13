import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
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

@Component({
	selector: 'view-document',
	templateUrl: './view-document.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewDocumentComponent implements OnInit, AfterViewInit, OnDestroy {
	private _unsubscribeAll: Subject<any> = new Subject<any>();
	documentId: string;
	document: Documente | null = null;
	fileBlob: Blob;
	/**
	 * Constructor
	 */
	constructor(
		private _firmaDocsWFPComponent: FirmaDocsWFPComponent,
		private _fileManagerService: FileManagerService,
		private _router: Router,
		private _cdr: ChangeDetectorRef,
		private _activatedRoute: ActivatedRoute
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

			this.document = this._firmaDocsWFPComponent.items.find(
				(item) => item.id === this.documentId
			);
			this.downloadFile();
		});
		this._firmaDocsWFPComponent.matDrawer.open();
	}

	ngAfterViewInit(): void {}

	/**
	 * Setter for bar search input
	 *
	 * @param value
	 */
	@ViewChild('EmailOrPhone')
	set EmailOrPhone(value: ElementRef) {
		// If the value exists, it means that the search input
		// is now in the DOM, and we can focus on the input..
		if (value) {
			// Give Angular time to complete the change detection cycle
			setTimeout(() => {
				// Focus to the input element
				value.nativeElement.focus();
			});
		}
		//
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
			},
			error: (error) => {
				// Handle any other errors here.
				console.error('An error occurred while downloading the file', error);
			},
		});
	}
}
