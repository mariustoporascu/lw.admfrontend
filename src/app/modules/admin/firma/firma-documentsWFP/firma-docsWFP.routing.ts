import { Route } from '@angular/router';
import { FirmaDocsWFPResolver } from './firma-docsWFP.resolvers';
import { FirmaDocsWFPComponent } from './firma-docsWFP.component';

export const firmaDocsWFPRoutes: Route[] = [
	{
		path: '',
		component: FirmaDocsWFPComponent,
		resolve: {
			serverData: FirmaDocsWFPResolver,
		},
	},
];
