import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	Validators,
} from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';

@Component({
	selector: 'settings-account',
	templateUrl: './account.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsAccountComponent implements OnInit {
	accountForm: UntypedFormGroup;
	private _userType: string;

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
			this.accountForm = this._formBuilder.group({
				name: [user.name, Validators.required],
				firstName: [user.firstName, Validators.required],
				email: [user.email, Validators.email],
				phoneNumber: [user.phoneNumber, Validators.required],
			});
		});
	}
	/**
	 * Reset password
	 */
	updateProfile(): void {
		// Return if the form is invalid
		if (this.accountForm.invalid) {
			return;
		}

		// Disable the form
		this.accountForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Send the request to the server
		this._authService
			.updateProfile(this.accountForm.value)
			.subscribe({
				next: (response) => {
					// Set the alert
					this._authService.signInUsingRefreshToken().subscribe();
					this.alert = {
						type: 'success',
						message: 'Profilul a fost actualizat.',
					};
				},
				error: (err) => {
					if (err.error) {
						// Set the alert
						this.alert = {
							type: 'error',
							message: 'Profilul nu a putut fi actualizat.',
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
				this.accountForm.enable();

				// Show the alert
				this.showAlert = true;
			});
	}
}
