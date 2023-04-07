import { Route } from '@angular/router';
import { FileManagerDetailsComponent } from './details/details.component';
import { FileManagerComponent } from './file-manager.component';
import { CanDeactivateFileManagerDetails } from './file-manager.guards';
import { FileManagerListComponent } from './list/list.component';
import {
	FileManagerFolderResolver,
	FileManagerItemResolver,
	FileManagerItemsResolver,
} from './file-manager.resolvers';

export const fileManagerRoutes: Route[] = [
	{
		path: '',
		component: FileManagerComponent,
		children: [
			{
				path: 'folders/:folderId',
				component: FileManagerListComponent,
				resolve: {
					item: FileManagerFolderResolver,
				},
				children: [
					{
						path: 'details/:id',
						component: FileManagerDetailsComponent,
						canDeactivate: [CanDeactivateFileManagerDetails],
						resolve: {
							item: FileManagerItemResolver,
						},
					},
				],
			},
			{
				path: '',
				component: FileManagerListComponent,
				resolve: {
					items: FileManagerItemsResolver,
				},
				children: [
					{
						path: 'details/:id',
						component: FileManagerDetailsComponent,
						canDeactivate: [CanDeactivateFileManagerDetails],
						resolve: {
							item: FileManagerItemResolver,
						},
					},
				],
			},
		],
	},
];
