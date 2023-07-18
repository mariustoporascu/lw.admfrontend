import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { UserTypeGuard } from './core/auth/guards/usertype.guard';
import { NotFoundGuard } from './core/auth/guards/notFound.guard';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [
	// Landing routes
	{
		path: '',
		pathMatch: 'full',
		component: LayoutComponent,
		data: {
			layout: 'empty',
		},
		loadChildren: () =>
			import('app/modules/landing/home/home.module').then(
				(m) => m.LandingHomeModule
			),
	},

	// User routes
	{
		path: 'user',
		data: { userType: 'user' },
		canMatch: [AuthGuard, UserTypeGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () =>
					import('app/modules/user/user-dash/user-dash.module').then(
						(m) => m.UserDashModule
					),
			},
			{
				path: 'transfers',
				loadChildren: () =>
					import(
						'app/modules/user/user-transf-history/user-transf-history.module'
					).then((m) => m.UserTransfHistoryModule),
			},
			{
				path: 'withdraws',
				loadChildren: () =>
					import(
						'app/modules/user/user-withd-history/user-withd-history.module'
					).then((m) => m.UserWithdHistoryModule),
			},

			{
				path: 'filemanager',
				data: { baseRoute: '/user/filemanager' },
				loadChildren: () =>
					import('app/modules/utilities/file-manager/file-manager.module').then(
						(m) => m.FileManagerModule
					),
			},
			{
				path: 'settings',
				loadChildren: () =>
					import('app/modules/user/user-settings/settings.module').then(
						(m) => m.SettingsModule
					),
			},
			{
				path: 'operations',
				loadChildren: () =>
					import('app/modules/user/user-operations/user-operations.module').then(
						(m) => m.UserOperationsModule
					),
			},
			{
				path: 'all-documents',
				loadChildren: () =>
					import('app/modules/user/user-documents/user-documents.module').then(
						(m) => m.UserAllDocumentsModule
					),
			},
		],
	},
	// Firma routes
	{
		path: 'firma-admin',
		canMatch: [AuthGuard, UserTypeGuard],
		data: { userType: 'firma-admin' },
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				canMatch: [],
				loadChildren: () =>
					import('app/modules/admin/firma/firma-dash/firma-dash.module').then(
						(m) => m.FirmaDashModule
					),
			},
			{
				path: 'analytics',
				loadChildren: () =>
					import('app/modules/landing/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'docsapproval',
				loadChildren: () =>
					import(
						'app/modules/admin/firma/firma-documentsWFP/firma-docsWFP.module'
					).then((m) => m.FirmaDocsWFPModule),
			},
			{
				path: 'alldocuments',
				loadChildren: () =>
					import('app/modules/admin/firma/firma-alldocs/firma-alldocs.module').then(
						(m) => m.FirmaAllDocsModule
					),
			},
			{
				path: 'internalusrs',
				loadChildren: () =>
					import('app/modules/landing/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'settings',
				loadChildren: () =>
					import('app/modules/admin/admin-settings/settings.module').then(
						(m) => m.SettingsModule
					),
			},
			{
				path: 'pointsofsale',
				loadChildren: () =>
					import(
						'app/modules/admin/firma/firma-ext-usrs/firma-ext-usrs.module'
					).then((m) => m.FirmaExternalUsersModule),
			},
		],
	},
	// Hybrid routes
	{
		path: 'user-admin',
		data: { userType: 'user-admin' },
		canMatch: [AuthGuard, UserTypeGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () =>
					import('app/modules/user/user-dash/user-dash.module').then(
						(m) => m.UserDashModule
					),
			},
			{
				path: 'transfers',
				loadChildren: () =>
					import(
						'app/modules/user/user-transf-history/user-transf-history.module'
					).then((m) => m.UserTransfHistoryModule),
			},
			{
				path: 'filemanager',
				data: { baseRoute: '/user-admin/filemanager' },
				loadChildren: () =>
					import('app/modules/utilities/file-manager/file-manager.module').then(
						(m) => m.FileManagerModule
					),
			},
			{
				path: 'settings',
				loadChildren: () =>
					import('app/modules/user/user-settings/settings.module').then(
						(m) => m.SettingsModule
					),
			},
			{
				path: 'operations',
				loadChildren: () =>
					import('app/modules/user/user-operations/user-operations.module').then(
						(m) => m.UserOperationsModule
					),
			},
			{
				path: 'all-documents',
				loadChildren: () =>
					import('app/modules/user/user-documents/user-documents.module').then(
						(m) => m.UserAllDocumentsModule
					),
			},
		],
	},
	// Master routes
	{
		path: 'master-admin',
		data: { userType: 'master-admin' },
		canMatch: [AuthGuard, UserTypeGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'dashboard',
				loadChildren: () =>
					import('app/modules/admin/master/master-dash/master-dash.module').then(
						(m) => m.MasterDashModule
					),
			},
			{
				path: 'documente-platforma',
				loadChildren: () =>
					import(
						'app/modules/admin/master/master-documente/master-documente.module'
					).then((m) => m.MasterDocsModule),
			},
			{
				path: 'documente-pre-approval',
				loadChildren: () =>
					import(
						'app/modules/admin/master/master-documente-preapp/master-documente-preapp.module'
					).then((m) => m.MasterDocsPreAppModule),
			},
			{
				path: 'firme-platforma',
				loadChildren: () =>
					import('app/modules/admin/master/master-firme/master-firme.module').then(
						(m) => m.MasterFirmeModule
					),
			},
			{
				path: 'edit-firma',
				loadChildren: () =>
					import(
						'app/modules/admin/master/master-firma-form/master-firma-form.module'
					).then((m) => m.MasterFirmaFormModule),
			},
			{
				path: 'settings',
				loadChildren: () =>
					import('app/modules/admin/admin-settings/settings.module').then(
						(m) => m.SettingsModule
					),
			},
		],
	},
	// Auth routes
	{
		path: 'auth',
		component: LayoutComponent,
		data: {
			layout: 'empty',
		},
		children: [
			{
				path: 'sign-out',
				canMatch: [AuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-out/sign-out.module').then(
						(m) => m.AuthSignOutModule
					),
			},
			{
				path: 'unlock-session',
				canMatch: [AuthGuard],
				loadChildren: () =>
					import('app/modules/auth/unlock-session/unlock-session.module').then(
						(m) => m.AuthUnlockSessionModule
					),
			},
			{
				path: 'confirmation-required',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import(
						'app/modules/auth/confirmation-required/confirmation-required.module'
					).then((m) => m.AuthConfirmationRequiredModule),
			},
			{
				path: 'confirmation-completion',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import(
						'app/modules/auth/confirmation-completion/confirmation-completion.module'
					).then((m) => m.AuthConfirmationCompletionModule),
			},
			{
				path: 'forgot-password',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/forgot-password/forgot-password.module').then(
						(m) => m.AuthForgotPasswordModule
					),
			},
			{
				path: 'reset-password',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/reset-password/reset-password.module').then(
						(m) => m.AuthResetPasswordModule
					),
			},
			{
				path: 'sign-in',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-in/sign-in.module').then(
						(m) => m.AuthSignInModule
					),
			},
			{
				path: 'sign-up',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-up/sign-up.module').then(
						(m) => m.AuthSignUpModule
					),
			},
		],
	},
	{
		path: 'redirectToDashboard',
		canMatch: [NotFoundGuard],
		loadChildren: () =>
			import('app/modules/error/error-500/error-500.module').then(
				(m) => m.Error500Module
			),
	},
	// 404 & Catch all
	{
		path: '404-not-found',
		loadChildren: () =>
			import('app/modules/error/error-404/error-404.module').then(
				(m) => m.Error404Module
			),
	},
	{ path: '**', redirectTo: '404-not-found' },
];
