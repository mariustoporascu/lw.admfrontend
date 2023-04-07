/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'pf-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:cash',
				link: '/user/pf-dashboard',
			},
			{
				id: 'dashboard.analytics',
				title: 'Analitice',
				type: 'basic',
				icon: 'heroicons_outline:chart-pie',
				link: '/user/pf-analytics',
			},
		],
	},
	{
		id: 'utilities',
		title: 'Utilitati',
		subtitle: '',
		type: 'group',
		userType: 'pf-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'utilities.filemanager',
				title: 'Incarcare fisiere',
				type: 'basic',
				icon: 'heroicons_outline:cloud',
				link: '/user/pf-filemanager',
			},
		],
	},
	{
		id: 'dashboard',
		title: 'Dashboard',
		subtitle: '',
		type: 'group',
		userType: 'pj-admin',
		icon: 'heroicons_outline:home',
		children: [
			{
				id: 'dashboard.statistics',
				title: 'Statistici',
				type: 'basic',
				icon: 'heroicons_outline:cash',
				link: '/user/pj-dashboard',
			},
			{
				id: 'dashboard.analytics',
				title: 'Analitice',
				type: 'basic',
				icon: 'heroicons_outline:chart-pie',
				link: '/user/pj-analytics',
			},
		],
	},
];
