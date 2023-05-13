import { Route } from '@angular/router';
import { FirmaDocsWFPResolver } from './firma-docsWFP.resolvers';
import { FirmaDocsWFPComponent } from './firma-docsWFP.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { CanDeactivateViewDocumentComponent } from './firma-docsWFP.guards';

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
