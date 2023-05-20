import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	NgForm,
	Validators,
} from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'auth-reset-password',
	templateUrl: './reset-password.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class AuthResetPasswordComponent implements OnInit {
	private _token: string;
	private _email: string;
	@ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	resetPasswordForm: UntypedFormGroup;
	showAlert: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private route: ActivatedRoute,
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
		this.route.queryParams.subscribe((params) => {
			this._token = params['token'];
			this._email = params['email'];
			// Create the form
			this.resetPasswordForm = this._formBuilder.group(
				{
					email: [this._email, [Validators.required, Validators.email]],
					password: [
						'',
						[
							Validators.required,
							Validators.pattern(
								'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
							),
						],
					],
					passwordConfirm: [
						'',
						[
							Validators.required,
							Validators.pattern(
								'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
							),
						],
					],
				},
				{
					validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
				}
			);
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Reset password
	 */
	resetPassword(): void {
		// Return if the form is invalid
		if (this.resetPasswordForm.invalid) {
			return;
		}

		// Disable the form
		this.resetPasswordForm.disable();

		// Hide the alert
		this.showAlert = false;
		// Send the request to the server
		this._authService
			.resetPassword(this._token, this.resetPasswordForm.value)
			.subscribe({
				next: () => {
					// Set the alert
					this.resetPasswordNgForm.resetForm();
					this.alert = {
						type: 'success',
						message: 'Parola a fost resetata.',
					};
				},
				error: (err) => {
					console.log(err);
					this.resetPasswordForm.get('email').setValue(this._email);
					if (err.error) {
						this.alert = {
							type: 'error',
							message: 'Parola nu a putut fi resetata.',
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
				this.resetPasswordForm.enable();

				// Show the alert
				this.showAlert = true;
			});
	}
}
