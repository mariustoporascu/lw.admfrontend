import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
	UntypedFormBuilder,
	UntypedFormGroup,
	NgForm,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { catchError, of, switchMap } from 'rxjs';

@Component({
	selector: 'auth-sign-in',
	templateUrl: './sign-in.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class AuthSignInComponent implements OnInit {
	@ViewChild('signInNgForm') signInNgForm: NgForm;

	alert: { type: FuseAlertType; message: string } = {
		type: 'success',
		message: '',
	};
	signInForm: UntypedFormGroup;
	showAlert: boolean = false;
	showResendEmailConfirmation: boolean = false;
	/**
	 * Constructor
	 */
	constructor(
		private _activatedRoute: ActivatedRoute,
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
		this.signInForm = this._formBuilder.group({
			email: ['office@topodvlp.website', [Validators.required, Validators.email]],
			password: ['Vib3r0n3@', Validators.required],
			rememberMe: [''],
		});
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Sign in
	 */
	signIn(): void {
		// Return if the form is invalid
		if (this.signInForm.invalid) {
			return;
		}

		// Disable the form
		this.signInForm.disable();

		// Hide the alert
		this.showAlert = false;

		// Sign in
		this._authService.signIn(this.signInForm.value).subscribe({
			next: (response) => {
				const redirectURL =
					this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || null;

				// Navigate to the redirect url
				redirectURL ? this._router.navigateByUrl(redirectURL) : location.reload();
			},
			error: (error) => {
				// Re-enable the form
				this.signInForm.enable();

				// Reset the form
				this.signInNgForm.form.markAsPristine();
				this.signInNgForm.form.markAsUntouched();
				if (error === 'Email not confirmed') {
					// Set the alert
					this.alert = {
						type: 'error',
						message: 'Email-ul nu a fost confirmat.',
					};
					this.showResendEmailConfirmation = true;
				} else {
					// Set the alert
					this.alert = {
						type: 'error',
						message: 'Email sau parola gresite',
					};
				}

				// Show the alert
				this.showAlert = true;
			},
		});
	}
	resendConfirmationEmail(): void {
		// Return if the form is invalid
		if (this.signInForm.invalid) {
			return;
		}

		// Disable the form
		this.signInForm.disable();

		// Hide the alert
		this.showAlert = false;

		this._authService
			.resendConfirmationEmail(this.signInForm.get('email').value)
			.subscribe((res) => {
				// Re-enable the form
				this.signInForm.enable();

				// Reset the form
				this.signInNgForm.form.markAsPristine();
				this.signInNgForm.form.markAsUntouched();
				if (res.error) {
					// Set the alert
					this.alert = {
						type: 'error',
						message: 'Email-ul de confirmare nu a putut fi transmis.',
					};
				} else {
					// Set the alert
					this.alert = {
						type: 'success',
						message: 'Email-ul de confirmare a fost transmis.',
					};
					this.showResendEmailConfirmation = false;
				}
				// Show the alert
				this.showAlert = true;
			});
	}
}
