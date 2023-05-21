import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	NgForm,
	Validators,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
	selector: 'auth-forgot-password',
	templateUrl: './forgot-password.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class AuthForgotPasswordComponent implements OnInit {
	@ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	forgotPasswordForm: UntypedFormGroup;
	showAlert: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _authService: AuthService,
		private _formBuilder: UntypedFormBuilder
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Create the form
		this.forgotPasswordForm = this._formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Send the reset link
	 */
	sendResetLink(): void {
		// Return if the form is invalid
		if (this.forgotPasswordForm.invalid) {
			return;
		}

		// Disable the form
		this.forgotPasswordForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Forgot password
		this._authService
			.forgotPassword(this.forgotPasswordForm.get('email').value)
			.subscribe({
				next: (response) => {
					this.forgotPasswordNgForm.resetForm();
					// Set the alert
					this.alert = {
						type: 'success',
						message:
							'Un link de resetare a parolei a fost trimis la adresa de email.',
					};
				},
				error: (err) => {
					if (err.error) {
						this.alert = {
							type: 'error',
							message: 'Email-ul nu a fost gasit in sistemul nostru.',
						};
					} else {
						this.alert = {
							type: 'warning',
							message: 'Eroare pe server. Echipa tehnica a fost notificata.',
						};
					}
				},
			})
			.add(() => {
				this.forgotPasswordForm.enable();
				// Show the alert
				this.showAlert = true;
			});
	}
}
