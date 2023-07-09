import { Route } from '@angular/router';
import { MasterFirmaFormComponent } from './master-firma-form.component';
import { MasterFirmaFormResolver } from './master-firma-form.resolvers';

export const masterFirmaFormRoutes: Route[] = [
	{
		path: '',
		component: MasterFirmaFormComponent,
		resolve: {
			serverData: MasterFirmaFormResolver,
		},
	},
];
