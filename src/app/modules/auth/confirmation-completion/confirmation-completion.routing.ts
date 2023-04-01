import { Route } from '@angular/router';
import { AuthConfirmationCompletionComponent } from 'app/modules/auth/confirmation-completion/confirmation-completion.component';

export const authConfirmationCompletionRoutes: Route[] = [
	{
		path: '',
		component: AuthConfirmationCompletionComponent,
	},
];
