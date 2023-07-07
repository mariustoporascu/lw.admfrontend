import { Route } from '@angular/router';
import { MasterDashComponent } from './master-dash.component';
import { MasterDashDataResolver } from './master-dash.resolvers';

export const masterDashRoutes: Route[] = [
	{
		path: '',
		component: MasterDashComponent,
		resolve: {
			serverData: MasterDashDataResolver,
		},
	},
];
