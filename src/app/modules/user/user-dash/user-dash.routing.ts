import { Route } from '@angular/router';
import { UserDashComponent } from './user-dash.component';
import { UserDashDataResolver } from './user-dash.resolvers';

export const userDashRoutes: Route[] = [
	{
		path: '',
		component: UserDashComponent,
		resolve: {
			serverData: UserDashDataResolver,
		},
	},
];
