import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import {
	NgForm,
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
	selector: 'settings-security',
	templateUrl: './security.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsSecurityComponent implements OnInit {
	private _email: string;
	@ViewChild('securityNgForm') securityNgForm: NgForm;
	securityForm: UntypedFormGroup;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	showAlert: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _authService: AuthService,
		private _formBuilder: UntypedFormBuilder,
		private userService: UserService
	) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Lifecycle hooks
	// -----------------------------------------------------------------------------------------------------

	/**
	 * On init
	 */
	ngOnInit(): void {
		// Get the user data
		this.userService.user$.subscribe((user) => {
			// Create the form
			this._email = user.email;
		});
		// Create the form
		this.securityForm = this._formBuilder.group(
			{
				password: [
					'',
					[
						Validators.required,
						Validators.pattern(
							'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
						),
					],
				],
				newPassword: [
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
				validators: FuseValidators.mustMatch('newPassword', 'passwordConfirm'),
			}
		);
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Reset password
	 */
	changePassword(): void {
		// Return if the form is invalid
		if (this.securityForm.invalid) {
			return;
		}

		// Disable the form
		this.securityForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Send the request to the server
		this._authService
			.changePassword({ ...this.securityForm.value, email: this._email })
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
							message: 'Parola nu a putut fi schimbata.',
						};
						return of(false);
					} else {
						// Set the alert
						this.securityNgForm.resetForm();
						this.alert = {
							type: 'success',
							message: 'Parola a fost schimbata.',
						};
						return of(true);
					}
				})
			)
			.subscribe();
	}
}
