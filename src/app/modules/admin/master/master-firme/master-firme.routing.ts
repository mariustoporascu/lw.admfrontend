import { Route } from '@angular/router';
import { MasterFirmeResolver } from './master-firme.resolvers';
import { MasterFirmeComponent } from './master-firme.component';

export const masterFirmeRoutes: Route[] = [
	{
		path: '',
		component: MasterFirmeComponent,
		resolve: {
			serverData: MasterFirmeResolver,
		},
	},
];
