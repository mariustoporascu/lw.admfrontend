import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	NgForm,
	UntypedFormGroup,
	UntypedFormBuilder,
	Validators,
} from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { FirmaFunctDataService } from 'app/core/firma-funct-data/firma-funct-data.service';
import { Subject, catchError, of, switchMap } from 'rxjs';

@Component({
	selector: 'add-new-ext',
	templateUrl: './add-new-ext.component.html',
	encapsulation: ViewEncapsulation.None,
})
export class AddExternalGroupComponent implements OnInit {
	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;
	@ViewChild('securityNgForm') securityNgForm: NgForm;
	securityForm: UntypedFormGroup;

	/**
	 * Constructor
	 */
	constructor(
		private _formBuilder: UntypedFormBuilder,
		private _firmaFunctDataService: FirmaFunctDataService
	) {}
	ngOnInit(): void {
		// Create the form
		this.securityForm = this._formBuilder.group({
			name: ['', [Validators.required]],
			initialEmail: ['', [Validators.required, Validators.email]],
			initialPassword: [
				'',
				[
					Validators.required,
					Validators.pattern(
						'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
					),
				],
			],
		});
	}

	createHybrid(): void {
		// Return if the form is invalid
		if (this.securityForm.invalid) {
			return;
		}

		// Disable the form
		this.securityForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Send the request to the server
		this._firmaFunctDataService
			.createHybrid({ ...this.securityForm.value })
			.pipe(
				catchError((error: any) => of(error.error)),
				switchMap((response: any) => {
					// If there is an error...
					this.securityForm.enable();

					// Show the alert
					this.showAlert = true;

					if (response.error) {
						// Set the alert
						this.alert = {
							type: 'error',
							message: 'Grupul nu a putut fi creat.',
						};
						return of(false);
					} else {
						// Set the alert
						this.securityNgForm.resetForm();
						this.alert = {
							type: 'success',
							message: 'Grupul a fost creat.',
						};
						return of(true);
					}
				})
			)
			.subscribe();
	}
}
