import { Route } from '@angular/router';
import { UserOperationsComponent } from './user-documents.component';
import { UserFunctDataResolver } from './user-documents.resolvers';
import { CanDeactivateViewDocumentComponent } from './user-documents.guards';
import { ViewDocumentComponent } from './view-document/view-document.component';

export const userOperationsRoutes: Route[] = [
	{
		path: '',
		component: UserOperationsComponent,
		resolve: {
			serverData: UserFunctDataResolver,
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
