import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { UserTypeGuard } from './core/auth/guards/usertype.guard';

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
		canMatch: [AuthGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'pf-dashboard',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/user/user-dash/user-dash.module').then(
						(m) => m.UserDashModule
					),
			},
			{
				path: 'pj-dashboard',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/user/user-dash/user-dash.module').then(
						(m) => m.UserDashModule
					),
			},
			{
				path: 'pf-analytics',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/admin/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'pj-analytics',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/admin/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'pf-filemanager',
				data: { baseRoute: '/user/pf-filemanager' },

				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/utilities/file-manager/file-manager.module').then(
						(m) => m.FileManagerModule
					),
			},
			{
				path: 'pj-filemanager',
				data: { baseRoute: '/user/pj-filemanager' },
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/utilities/file-manager/file-manager.module').then(
						(m) => m.FileManagerModule
					),
			},
		],
	},
	// Admin routes
	{
		path: 'admin',
		canMatch: [AuthGuard],
		component: LayoutComponent,
		children: [
			{
				path: 'firma-dashboard',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/admin/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'hybrid-dashboard',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/admin/example/example.module').then(
						(m) => m.ExampleModule
					),
			},
			{
				path: 'master-dashboard',
				canMatch: [UserTypeGuard],
				loadChildren: () =>
					import('app/modules/admin/example/example.module').then(
						(m) => m.ExampleModule
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
				pathMatch: 'full',
				canMatch: [AuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-out/sign-out.module').then(
						(m) => m.AuthSignOutModule
					),
			},
			{
				path: 'unlock-session',
				pathMatch: 'full',
				canMatch: [AuthGuard],
				loadChildren: () =>
					import('app/modules/auth/unlock-session/unlock-session.module').then(
						(m) => m.AuthUnlockSessionModule
					),
			},
			{
				path: 'confirmation-required',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import(
						'app/modules/auth/confirmation-required/confirmation-required.module'
					).then((m) => m.AuthConfirmationRequiredModule),
			},
			{
				path: 'confirmation-completion',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import(
						'app/modules/auth/confirmation-completion/confirmation-completion.module'
					).then((m) => m.AuthConfirmationCompletionModule),
			},
			{
				path: 'forgot-password',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/forgot-password/forgot-password.module').then(
						(m) => m.AuthForgotPasswordModule
					),
			},
			{
				path: 'reset-password',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/reset-password/reset-password.module').then(
						(m) => m.AuthResetPasswordModule
					),
			},
			{
				path: 'sign-in',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-in/sign-in.module').then(
						(m) => m.AuthSignInModule
					),
			},
			{
				path: 'sign-up',
				pathMatch: 'full',
				canMatch: [NoAuthGuard],
				loadChildren: () =>
					import('app/modules/auth/sign-up/sign-up.module').then(
						(m) => m.AuthSignUpModule
					),
			},
		],
	},

	// 404 & Catch all
	{
		path: '404-not-found',
		pathMatch: 'full',
		loadChildren: () =>
			import('app/modules/error/error-404/error-404.module').then(
				(m) => m.Error404Module
			),
	},
	{ path: '**', redirectTo: '404-not-found' },
];
