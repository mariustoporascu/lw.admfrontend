import { Route } from '@angular/router';
import { UserOperationsComponent } from './user-operations.component';
import { UserFunctDataResolver } from './user-operations.resolvers';
import { SearchForUserComponent } from './search-user/search-user.component';
import { CanDeactivateSearchForUser } from './user-operations.guards';

export const userOperationsRoutes: Route[] = [
	{
		path: '',
		component: UserOperationsComponent,
		resolve: {
			serverData: UserFunctDataResolver,
		},
		children: [
			{
				path: 'search-user',
				component: SearchForUserComponent,
				canDeactivate: [CanDeactivateSearchForUser],
			},
		],
	},
];
