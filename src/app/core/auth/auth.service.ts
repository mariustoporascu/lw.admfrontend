import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	BehaviorSubject,
	catchError,
	Observable,
	of,
	switchMap,
	throwError,
} from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { backendUrl } from '../config/app.config';

@Injectable()
export class AuthService {
	private _authenticated: BehaviorSubject<boolean> =
		new BehaviorSubject<boolean>(false);
	private _backEndUrl: string = backendUrl;
	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Setter & getter for access token
	 */
	set accessToken(token: string) {
		localStorage.setItem('accessToken', token);
	}

	get accessToken(): string {
		return localStorage.getItem('accessToken') ?? '';
	}

	set refreshToken(token: string) {
		localStorage.setItem('refreshToken', token);
	}

	get refreshToken(): string {
		return localStorage.getItem('refreshToken') ?? '';
	}
	set refreshTokenId(token: string) {
		localStorage.setItem('refreshTokenId', token);
	}

	get refreshTokenId(): string {
		return localStorage.getItem('refreshTokenId') ?? '';
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Forgot password
	 *
	 * @param email
	 */
	forgotPassword(email: string): Observable<any> {
		return this._httpClient.put(
			`${this._backEndUrl}/auth/password-reset-token`,
			{},
			{
				params: {
					email: email,
				},
			}
		);
	}

	/**
	 * Reset password
	 *
	 * @param password
	 */
	resetPassword(token: string, user: any): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/auth/password-reset`,
			{ ...user },
			{ params: { resetPasswordToken: token } }
		);
	}

	/**
	 * Sign in
	 *
	 * @param credentials
	 */
	signIn(credentials: { email: string; password: string }): Observable<any> {
		// Throw error, if the user is already logged in
		if (this._authenticated.value) {
			return throwError('User is already logged in.');
		}

		return this._httpClient
			.post(`${this._backEndUrl}/auth/login`, credentials)
			.pipe(
				switchMap((response: any) => {
					if (!response.token) {
						if (response.error) {
							return throwError(response.message);
						}
						return throwError('Auth token is not supplied');
					}
					// Store the access token in the local storage
					this.accessToken = response.token;
					this.refreshToken = response.refreshToken;
					this.refreshTokenId = response.refreshTokenId;

					// Set the authenticated flag to true
					this._authenticated.next(true);

					// Return a new observable with the response
					return of(true);
				})
			);
	}

	/**
	 * Confirm email using the token
	 */
	confirmEmailUsingToken(token: string, email: string): Observable<any> {
		return this._httpClient.get(
			`${this._backEndUrl}/auth/confirm-email?emailConfirmationToken=${token}&email=${email}`
		);
	}

	/**
	 * Resend confirmation Email
	 */
	resendConfirmationEmail(email: string): Observable<any> {
		return this._httpClient.put(
			`${this._backEndUrl}/auth/resend-confirmation-email`,
			{},
			{
				params: {
					email: email,
				},
			}
		);
	}

	/**
	 * Sign in using the access token
	 */
	signInUsingRefreshToken(): Observable<any> {
		// Sign in using the token
		return this._httpClient
			.get(
				`${this._backEndUrl}/auth/refresh-token?refreshToken=${this.refreshToken}&refreshTokenId=${this.refreshTokenId}`
			)
			.pipe(
				catchError(() =>
					// Return false
					of(false)
				),
				switchMap((response: any) => {
					if (!response.token) {
						return of(false);
					}
					// Replace the access token with the new one if it's available on
					// the response object.
					//
					// This is an added optional step for better security. Once you sign
					// in using the token, you should generate a new one on the server
					// side and attach it to the response object. Then the following
					// piece of code can replace the token with the refreshed one.
					this.accessToken = response.token;

					// Set the authenticated flag to true
					this._authenticated.next(true);

					// Return true
					return of(true);
				})
			);
	}

	/**
	 * Sign out
	 */
	signOut(): Observable<any> {
		if (this.refreshTokenId) {
			this._httpClient
				.put(
					`${this._backEndUrl}/auth/logout`,
					{},
					{
						params: {
							refreshTokenId: this.refreshToken,
						},
					}
				)
				.subscribe();
		}
		// Remove the access token from the local storage
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('refreshTokenId');

		// Set the authenticated flag to false
		this._authenticated.next(false);

		// Return the observable
		return of(true);
	}

	/**
	 * Sign up
	 *
	 * @param user
	 */
	signUp(user: {
		name: string;
		email: string;
		password: string;
		company: string;
	}): Observable<any> {
		return this._httpClient.post(`${this._backEndUrl}/auth/register`, user);
	}

	/**
	 * Change password
	 *
	 * @param user
	 */
	changePassword(user: {
		email: string;
		password: string;
		newPassword: string;
	}): Observable<any> {
		return this._httpClient.post(
			`${this._backEndUrl}/auth/change-password`,
			user
		);
	}

	/**
	 * Update profile
	 *
	 * @param user
	 */
	updateProfile(user): Observable<any> {
		return this._httpClient.post(`${this._backEndUrl}/auth/update-profile`, user);
	}

	/**
	 * Unlock session
	 *
	 * @param credentials
	 */
	unlockSession(credentials: {
		email: string;
		password: string;
	}): Observable<any> {
		return this._httpClient.post('api/auth/unlock-session', credentials);
	}

	/**
	 * Check the authentication status
	 */
	check(): Observable<boolean> {
		// Check the access token expire date
		// If the refresh token exists sign in using it
		if (
			AuthUtils.isTokenExpired(this.accessToken) &&
			this.refreshToken &&
			this.refreshTokenId
		) {
			return this.signInUsingRefreshToken();
		}

		// Check if the user is logged in
		if (this._authenticated.value) {
			return of(true);
		}
		if (this.refreshToken && this.refreshTokenId) {
			return this.signInUsingRefreshToken();
		}

		return of(false);
	}
}
