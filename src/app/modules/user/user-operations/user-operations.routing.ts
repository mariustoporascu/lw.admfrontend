import { Route } from '@angular/router';
import { UserOperationsComponent } from './user-operations.component';
import { UserFunctDataResolver } from './user-operations.resolvers';

export const userOperationsRoutes: Route[] = [
	{
		path: '',
		component: UserOperationsComponent,
		resolve: {
			serverData: UserFunctDataResolver,
		},
	},
];
