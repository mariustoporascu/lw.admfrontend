import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
	selector: 'auth-confirmation-completion',
	templateUrl: './confirmation-completion.component.html',
	encapsulation: ViewEncapsulation.None,
	animations: fuseAnimations,
})
export class AuthConfirmationCompletionComponent implements OnInit {
	private _token: string;
	private _email: string;
	result: any;
	/**
	 * Constructor
	 */
	constructor(private route: ActivatedRoute, private authService: AuthService) {}
	ngOnInit(): void {
		this.route.queryParams.subscribe((params) => {
			this._token = params['token'];
			this._email = params['email'];
			this.authService
				.confirmEmailUsingToken(this._token, this._email)
				.subscribe((res) => {
					if (res.error) {
						this.result =
							'Email-ul nu a putut fi confirmat, sau a fost confirmat anterior.';
					} else {
						this.result = 'Email-ul a fost confirmat.';
					}
				});
		});
	}
}
