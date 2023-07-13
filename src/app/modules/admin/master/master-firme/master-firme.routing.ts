import { Route } from '@angular/router';
import {
	MasterFirmaResolver,
	MasterFirmeResolver,
} from './master-firme.resolvers';
import { MasterFirmeComponent } from './master-firme.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { CanDeactivateViewDetailsComponent } from './master-firme.guards';

export const masterFirmeRoutes: Route[] = [
	{
		path: '',
		component: MasterFirmeComponent,
		resolve: {
			serverData: MasterFirmeResolver,
		},
		children: [
			{
				path: 'view-details/:id',
				component: ViewDetailsComponent,
				canDeactivate: [CanDeactivateViewDetailsComponent],
				resolve: {
					item: MasterFirmaResolver,
				},
			},
		],
	},
];
