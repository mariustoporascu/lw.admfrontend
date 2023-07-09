import { Route } from '@angular/router';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { MasterDocsPreAppComponent } from './master-documente-preapp.component';
import { CanDeactivateViewDocumentComponent } from './master-documente-preapp.guards';
import { MasterDocsPreAppResolver } from './master-documente-preapp.resolvers';

export const masterDocsPreAppRoutes: Route[] = [
	{
		path: '',
		component: MasterDocsPreAppComponent,
		resolve: {
			serverData: MasterDocsPreAppResolver,
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
