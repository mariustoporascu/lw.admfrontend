import { Route } from '@angular/router';
import { FirmaDashComponent } from './firma-dash.component';
import { FirmaDashDataResolver } from './firma-dash.resolvers';

export const firmaDashRoutes: Route[] = [
	{
		path: '',
		component: FirmaDashComponent,
		resolve: {
			serverData: FirmaDashDataResolver,
		},
	},
];
