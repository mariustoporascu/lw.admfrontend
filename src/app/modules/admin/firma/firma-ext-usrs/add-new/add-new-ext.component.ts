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
			.subscribe({
				next: () => {
					// Set the alert
					this.securityNgForm.resetForm();
					this.alert = {
						type: 'success',
						message: 'Grupul a fost creat.',
					};
				},
				error: (err) => {
					if (err.error) {
						const message = err.message;
						if (message === 'Hybrid could not get created') {
							// Set the alert
							this.alert = {
								type: 'error',
								message: 'Grupul nu a putut fi creat.',
							};
						} else if (message === 'Hybrid name already exists') {
							this.alert = {
								type: 'warning',
								message: 'Ai deja un grup cu numele acesta.',
							};
						} else {
							this.alert = {
								type: 'warning',
								message: 'Userul cu emailul folosit exista deja in sistem.',
							};
						}
					} else {
						this.alert = {
							type: 'warning',
							message: 'Eroare pe server. Echipa tehnica a fost notificata.',
						};
					}
				},
			})
			.add(() => {
				// Show the alert
				this.showAlert = true;
				this.securityForm.enable();
			});
	}
}
