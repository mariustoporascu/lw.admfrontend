import { Route } from '@angular/router';
import { FirmaAllDocsResolver } from './firma-alldocs.resolvers';
import { FirmaAllDocsComponent } from './firma-alldocs.component';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { CanDeactivateViewDocumentComponent } from './firma-alldocs.guards';

export const firmaAllDocsRoutes: Route[] = [
	{
		path: '',
		component: FirmaAllDocsComponent,
		resolve: {
			serverData: FirmaAllDocsResolver,
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
