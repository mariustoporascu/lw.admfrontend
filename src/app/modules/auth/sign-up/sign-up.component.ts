import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	NgForm,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
	selector: 'auth-sign-up',
	templateUrl: './sign-up.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class AuthSignUpComponent implements OnInit {
	@ViewChild('signUpNgForm') signUpNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	signUpForm: UntypedFormGroup;
	showAlert: boolean = false;

	/**
	 * Constructor
	 */
	constructor(
		private _authService: AuthService,
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
		// Create the form
		this.signUpForm = this._formBuilder.group({
			name: ['Toporascu', Validators.required],
			firstName: ['Marius', Validators.required],
			email: ['office@topodvlp.website', [Validators.required, Validators.email]],
			password: [
				'Vib3r0n3@',
				[
					Validators.required,
					Validators.pattern(
						'^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$'
					),
				],
			],
			isBusiness: [false],
			agreements: [false, Validators.requiredTrue],
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Sign up
	 */
	signUp(): void {
		// Do nothing if the form is invalid
		if (this.signUpForm.invalid) {
			return;
		}

		// Disable the form
		this.signUpForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Sign up
		this._authService.signUp(this.signUpForm.value).subscribe({
			next: (response) => {
				this._router.navigateByUrl('/auth/confirmation-required');
			},
			error: (error) => {
				this.signUpForm.enable();

				// Reset the form
				this.signUpNgForm.form.markAsPristine();
				this.signUpNgForm.form.markAsUntouched();

				// Set the alert
				this.alert = {
					type: 'error',
					message: 'Contul nu a putut fi creat, te rugam sa reincerci.',
				};

				// Show the alert
				this.showAlert = true;
			},
		});
	}
}
