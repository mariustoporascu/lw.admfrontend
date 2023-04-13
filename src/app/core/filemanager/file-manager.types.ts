import { Documente, FirmaDiscount } from '../bkendmodels/models.types';

export interface Items {
	folders: Item[];
	files: Item[];
	path: any[];
}

export interface Item {
	id?: string;
	folderId?: string;
	folderInfo?: FirmaDiscount | null;
	type?: string;
	fileInfo?: Documente | null;
}
