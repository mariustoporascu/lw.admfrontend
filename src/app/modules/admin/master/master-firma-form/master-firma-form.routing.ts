import { Route } from '@angular/router';
import { MasterFirmaFormComponent } from './master-firma-form.component';
import { MasterFirmaByIdResolver } from './master-firma-form.resolvers';

export const masterFirmaFormRoutes: Route[] = [
	{
		path: '',
		component: MasterFirmaFormComponent,
	},
	{
		path: ':id',
		component: MasterFirmaFormComponent,
		resolve: {
			item: MasterFirmaByIdResolver,
		},
	},
];
