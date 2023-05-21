/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
	// user
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'user',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:chart-pie',
				link: '/user/dashboard',
			},
			{
				id: 'dashboard.operations',
				title: 'Operatiuni date incarcate',
				type: 'basic',
				icon: 'heroicons_outline:adjustments',
				link: '/user/operations',
			},
		],
	},
	{
		id: 'utilities',
		title: 'Utilitati',
		subtitle: '',
		type: 'group',
		userType: 'user',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'utilities.filemanager',
				title: 'Incarcare fisiere',
				type: 'basic',
				icon: 'heroicons_outline:cloud',
				link: '/user/filemanager',
			},
		],
	},
	{
		id: 'history',
		title: 'Istoric',
		subtitle: '',
		type: 'group',
		userType: 'user',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'history.transfer',
				title: 'Istoric transferuri',
				type: 'basic',
				icon: 'heroicons_outline:switch-horizontal',
				link: '/user/transfers',
			},
			{
				id: 'history.withdraw',
				title: 'Istoric retrageri',
				type: 'basic',
				icon: 'heroicons_outline:cash',
				link: '/user/withdraws',
			},
		],
	},
	// firma-admin
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'firma-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:cash',
				link: '/firma-admin/dashboard',
			},
			{
				id: 'dashboard.analytics',
				title: 'Analitice',
				type: 'basic',
				icon: 'heroicons_outline:chart-pie',
				link: '/firma-admin/analytics',
			},
		],
	},
	{
		id: 'accountsmgmt',
		title: 'Management conturi',
		subtitle: '',
		type: 'group',
		userType: 'firma-admin',
		icon: 'heroicons_outline:user-group',
		children: [
			{
				id: 'accountsmgmt.internalusrs',
				title: 'Useri interni',
				type: 'basic',
				icon: 'heroicons_outline:users',
				link: '/firma-admin/internalusrs',
			},
			{
				id: 'accountsmgmt.externalusrs',
				title: 'Useri externi',
				type: 'basic',
				icon: 'heroicons_outline:users',
				link: '/firma-admin/externalusrs',
			},
		],
	},
	{
		id: 'utilities',
		title: 'Utilitati',
		subtitle: '',
		type: 'group',
		userType: 'firma-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'utilities.docsapproval',
				title: 'Aprobare documente',
				type: 'basic',
				icon: 'heroicons_outline:document-duplicate',
				link: '/firma-admin/docsapproval',
			},
		],
	},
	// hybrid-admin
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'hybrid-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:chart-pie',
				link: '/hybrid-admin/dashboard',
			},
			{
				id: 'dashboard.operations',
				title: 'Operatiuni date incarcate',
				type: 'basic',
				icon: 'heroicons_outline:adjustments',
				link: '/hybrid-admin/operations',
			},
		],
	},
	{
		id: 'utilities',
		title: 'Utilitati',
		subtitle: '',
		type: 'group',
		userType: 'hybrid-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'utilities.filemanager',
				title: 'Incarcare fisiere',
				type: 'basic',
				icon: 'heroicons_outline:cloud',
				link: '/hybrid-admin/filemanager',
			},
		],
	},
	{
		id: 'history',
		title: 'Istoric',
		subtitle: '',
		type: 'group',
		userType: 'hybrid-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'history.transfer',
				title: 'Istoric transferuri',
				type: 'basic',
				icon: 'heroicons_outline:switch-horizontal',
				link: '/hybrid-admin/transfers',
			},
		],
	},
	{
		id: 'accountsmgmt',
		title: 'Management conturi',
		subtitle: '',
		type: 'group',
		userType: 'hybrid-admin',
		icon: 'heroicons_outline:user-group',
		children: [
			{
				id: 'accountsmgmt.internalusrs',
				title: 'Useri interni',
				type: 'basic',
				icon: 'heroicons_outline:users',
				link: '/hybrid-admin/internalusrs',
			},
			{
				id: 'accountsmgmt.externalusrs',
				title: 'Useri externi',
				type: 'basic',
				icon: 'heroicons_outline:users',
				link: '/hybrid-admin/externalusrs',
			},
		],
	},
];
