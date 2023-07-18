import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { FuseUtilsService } from '@fuse/services/utils';
import { Documente, FirmaDiscount } from 'app/core/bkendmodels/models.types';
import { SelectionModel } from '@angular/cdk/collections';
import { FuseAlertType } from '@fuse/components/alert';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MasterFunctDataService } from 'app/core/master-funct-data/master-funct-data.service';
import {
	FormBuilder,
	NgForm,
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { FuseValidators } from '@fuse/validators';

@Component({
	selector: 'master-firma-form',
	templateUrl: './master-firma-form.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MasterFirmaFormComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	recentTransactionsTableColumns: string[] = [
		'docNumber',
		'extractedBusinessData',
		'uploaded',
		'total',
		'discountValue',
		'userEmail',
	];
	firmaId: string;
	firmaDetails: FirmaDiscount;
	firmaFormGroup: UntypedFormGroup;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	@ViewChild('firmaNgForm') firmaNgForm: NgForm;

	private _unsubscribeAll: Subject<any> = new Subject<any>();

	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
		private _utilsService: FuseUtilsService,
		private _masterFunctDataService: MasterFunctDataService,
		private _cdr: ChangeDetectorRef,
		private _formBuilder: UntypedFormBuilder,
		private _router: Router
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		this._activatedRoute.paramMap.subscribe((params) => {
			this._utilsService.logger('params', params);
			this.firmaId = params.get('id');
			this._utilsService.logger('firmaId', this.firmaId);
			if (this.firmaId) {
				this._masterFunctDataService.firmaExtendedData$
					.pipe(takeUntil(this._unsubscribeAll))
					.subscribe((data) => {
						this.firmaDetails = data;
						this.firmaFormGroup = this._formBuilder.group({
							id: [this.firmaDetails.id, Validators.required],
							name: [this.firmaDetails.name, Validators.required],
							cuiNumber: [this.firmaDetails.cuiNumber, Validators.required],
							nrRegCom: [this.firmaDetails.nrRegCom, Validators.required],
							address: [this.firmaDetails.address, Validators.required],
							bankName: [this.firmaDetails.bankName, Validators.required],
							bankAccount: [this.firmaDetails.bankAccount, Validators.required],
							mainContactName: [
								this.firmaDetails.mainContactName,
								Validators.required,
							],
							mainContactEmail: [
								this.firmaDetails.mainContactEmail,
								[Validators.required, Validators.email],
							],
							mainContactPhone: [
								this.firmaDetails.mainContactPhone,
								[
									Validators.required,
									Validators.minLength(10),
									Validators.pattern('^[0-9]*$'),
								],
							],
							discountPercent: [
								this.firmaDetails.discountPercent,
								[Validators.required, Validators.min(1), Validators.max(100)],
							],
						});
						this._cdr.markForCheck();
					});
			} else {
				this.firmaFormGroup = this._formBuilder.group({
					name: ['', Validators.required],
					cuiNumber: ['', Validators.required],
					nrRegCom: ['', Validators.required],
					address: ['', Validators.required],
					bankName: ['', Validators.required],
					bankAccount: ['', Validators.required],
					mainContactName: ['', Validators.required],
					mainContactEmail: ['', [Validators.required, Validators.email]],
					mainContactPhone: [
						'',
						[
							Validators.required,
							Validators.minLength(10),
							Validators.pattern('^[0-9]*$'),
						],
					],
					discountPercent: [
						0,
						[Validators.required, Validators.min(1), Validators.max(100)],
					],
				});
			}
			this._cdr.markForCheck();
		});
	}

	/**
	 * After view init
	 */
	ngAfterViewInit(): void {}

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
	getAnafDetails(): void {
		const cuiNumber = this.firmaFormGroup.get('cuiNumber').value;
		if (!cuiNumber) {
			this.firmaFormGroup
				.get('cuiNumber')
				.setErrors({ invalidAnafResponse: true });
			this.firmaFormGroup.get('cuiNumber').markAsTouched();
			return;
		}
		this._masterFunctDataService
			.getFirmaAnafDetails(cuiNumber)
			.subscribe((data) => {
				this._utilsService.logger('data', data);
				if (!data || data.denumire === '') {
					this.firmaFormGroup
						.get('cuiNumber')
						.setErrors({ invalidAnafResponse: true });
					this.firmaFormGroup.get('cuiNumber').markAsTouched();
				} else {
					this.firmaFormGroup.get('name').setValue(data.denumire);
					this.firmaFormGroup.get('address').setValue(data.adresa);
					this.firmaFormGroup.get('nrRegCom').setValue(data.nrRegCom);
					const scopTva = data.scpTVA;
					this.firmaFormGroup
						.get('cuiNumber')
						.setValue(scopTva ? `RO${data.cui}` : data.cui);
				}
				this.firmaFormGroup.markAllAsTouched();
				this._cdr.markForCheck();
			});
	}
	onSubmit(): void {
		this._utilsService.logger('firmaFormGroup', this.firmaFormGroup);
		// Do nothing if the form is invalid
		if (this.firmaFormGroup.invalid) {
			return;
		}

		// Disable the form
		this.firmaFormGroup.disable();

		// Hide the alert
		this.showAlert = false;
		// Send to server
		this._masterFunctDataService
			.createOrUpdateFirma(this.firmaFormGroup.value, this.firmaId ? true : false)
			.subscribe({
				next: (response) => {
					this._router.navigateByUrl('/master-admin/firme-platforma');
				},
				error: (error) => {
					this.firmaFormGroup.enable();

					// Reset the form
					this.firmaNgForm.form.markAsPristine();
					this.firmaNgForm.form.markAsUntouched();
					if (error.error) {
						// Set the alert
						this.alert = {
							type: 'error',
							message: error.message,
						};
					} else {
						this.alert = {
							type: 'warning',
							message: 'Eroare pe server, echipa tehnică a fost notificată.',
						};
					}
					// Show the alert
					this.showAlert = true;
				},
			});
	}
}
