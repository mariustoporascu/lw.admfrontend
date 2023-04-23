import { Route } from '@angular/router';
import { UserWithdHistoryComponent } from './user-withd-history.component';
import { UserWithdDataResolver } from './user-withd-history.resolvers';

export const userWithdRoutes: Route[] = [
	{
		path: '',
		component: UserWithdHistoryComponent,
		resolve: {
			serverData: UserWithdDataResolver,
		},
	},
];
