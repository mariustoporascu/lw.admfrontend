import { Route } from '@angular/router';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { MasterDocsComponent } from './master-documente.component';
import { CanDeactivateViewDocumentComponent } from './master-documente.guards';
import { MasterDocsResolver } from './master-documente.resolvers';

export const masterDocsRoutes: Route[] = [
	{
		path: '',
		component: MasterDocsComponent,
		resolve: {
			serverData: MasterDocsResolver,
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
