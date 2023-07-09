import { Route } from '@angular/router';
import { FirmaDocsWFPResolver } from './master-firme.resolvers';
import { FirmaDocsWFPComponent } from './master-firme.component';
import { ViewDocumentComponent } from './view-firma-details/view-document.component';
import { CanDeactivateViewDocumentComponent } from './master-firme.guards';

export const firmaDocsWFPRoutes: Route[] = [
	{
		path: '',
		component: FirmaDocsWFPComponent,
		resolve: {
			serverData: FirmaDocsWFPResolver,
		},
		children: [
			{
				path: 'view-document/:id',
				component: ViewDocumentComponent,
				canDeactivate: [CanDeactivateViewDocumentComponent],
			},
		],
	},
];
