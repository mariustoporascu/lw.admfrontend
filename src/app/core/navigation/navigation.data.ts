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
				icon: 'heroicons_outline:presentation-chart-bar',
				link: '/user/dashboard',
			},
			{
				id: 'dashboard.alldocuments',
				title: 'Documentele tale',
				type: 'basic',
				icon: 'heroicons_outline:clipboard-document-list',
				link: '/user/all-documents',
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
			{
				id: 'utilities.operations',
				title: 'Operatiuni documente aprobate',
				type: 'basic',
				icon: 'heroicons_outline:adjustments-vertical',
				link: '/user/operations',
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
				icon: 'heroicons_outline:arrows-right-left',
				link: '/user/transfers',
			},
			{
				id: 'history.withdraw',
				title: 'Istoric retrageri',
				type: 'basic',
				icon: 'heroicons_outline:banknotes',
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
				icon: 'heroicons_outline:presentation-chart-bar',
				link: '/firma-admin/dashboard',
			},
			{
				id: 'dashboard.alldocuments',
				title: 'Toate documentele',
				type: 'basic',
				icon: 'heroicons_outline:clipboard-document-list',
				link: '/firma-admin/alldocuments',
			},
		],
	},
	{
		id: 'accountsmgmt',
		title: 'Management intern',
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
				title: 'Puncte de lucru',
				type: 'basic',
				icon: 'heroicons_outline:user-group',
				link: '/firma-admin/pointsofsale',
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
	// user-admin
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'user-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:presentation-chart-bar',
				link: '/user-admin/dashboard',
			},
			{
				id: 'dashboard.alldocuments',
				title: 'Documentele tale',
				type: 'basic',
				icon: 'heroicons_outline:clipboard-document-list',
				link: '/user-admin/all-documents',
			},
		],
	},
	{
		id: 'utilities',
		title: 'Utilitati',
		subtitle: '',
		type: 'group',
		userType: 'user-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'utilities.filemanager',
				title: 'Incarcare fisiere',
				type: 'basic',
				icon: 'heroicons_outline:cloud',
				link: '/user-admin/filemanager',
			},
			{
				id: 'utilities.operations',
				title: 'Operatiuni documente aprobate',
				type: 'basic',
				icon: 'heroicons_outline:adjustments-vertical',
				link: '/user-admin/operations',
			},
		],
	},
	{
		id: 'history',
		title: 'Istoric',
		subtitle: '',
		type: 'group',
		userType: 'user-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'history.transfer',
				title: 'Istoric transferuri',
				type: 'basic',
				icon: 'heroicons_outline:arrows-right-left',
				link: '/user-admin/transfers',
			},
		],
	},
	// master-admin
	// user
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'master-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:presentation-chart-bar',
				link: '/master-admin/dashboard',
			},
		],
	},
	{
		id: 'administrative',
		title: 'Administrativ',
		subtitle: '',
		type: 'group',
		userType: 'master-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'administrative.documentePlatforma',
				title: 'Documente platforma',
				type: 'basic',
				icon: 'heroicons_outline:document-duplicate',
				link: '/master-admin/documente-platforma',
			},
			{
				id: 'administrative.documentePreApproval',
				title: 'Documente la Pre Aprobari',
				type: 'basic',
				icon: 'heroicons_outline:document-text',
				link: '/master-admin/documente-pre-approval',
			},
			{
				id: 'administrative.listaFirmelor',
				title: 'Lista firmelor din platforma',
				type: 'basic',
				icon: 'heroicons_outline:building-office-2',
				link: '/master-admin/firme-platforma',
			},
		],
	},
];
