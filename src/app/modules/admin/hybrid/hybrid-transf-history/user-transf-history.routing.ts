import { Route } from '@angular/router';
import { UserTransfHistoryComponent } from './user-transf-history.component';
import { UserTransfDataResolver } from './user-transf-history.resolvers';

export const userTransfRoutes: Route[] = [
	{
		path: '',
		component: UserTransfHistoryComponent,
		resolve: {
			serverData: UserTransfDataResolver,
		},
	},
];
