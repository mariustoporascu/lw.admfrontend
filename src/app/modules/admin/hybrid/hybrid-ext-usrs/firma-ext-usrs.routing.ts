import { Route } from '@angular/router';
import { FirmaExternalUsersComponent } from './firma-ext-usrs.component';
import { FirmaExternalUsersResolver } from './firma-ext-usrs.resolvers';
import { ListExtUsersComponent } from './list-hybrids/list-ext-usrs.component';
import { AddExternalGroupComponent } from './add-new/add-new-ext.component';

export const firmaExternalUsersRoutes: Route[] = [
	{
		path: '',
		component: FirmaExternalUsersComponent,
		resolve: {
			serverData: FirmaExternalUsersResolver,
		},
		children: [
			{
				path: '',
				component: ListExtUsersComponent,
			},
			{
				path: 'add-ext-user',
				component: AddExternalGroupComponent,
			},
		],
	},
];
