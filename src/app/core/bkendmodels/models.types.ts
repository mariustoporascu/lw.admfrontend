import { User } from '../user/user.types';

export interface ConexiuniConturi {
	id: string;
	userId?: string;
	hybridId?: string;
	firmaDiscountId?: string;
	profilCont?: ProfilCont;
	tranzactii?: Tranzactii[];
	documente?: Documente[];
}
export interface Documente {
	id: string;
	isInvoice: boolean;
	status: number;
	statusName?: string;
	discountValue: number;
	ocrDataJson?: string;
	ocrData?: object;
	uploaded: Date;
	firmaDiscountId?: string;
	conexId?: string;
	nextConexId?: string;
	fisiereDocumente?: FisiereDocumente;
	conexiuniConturi?: ConexiuniConturi;
	nextConexiuniConturi?: ConexiuniConturi;
}

export interface FirmaDiscount {
	id: string;
	name?: string;
	cuiNumber?: string;
	nrRegCom?: string;
	address?: string;
	bankName?: string;
	bankAccount?: string;
	mainContactName?: string;
	mainContactEmail?: string;
	mainContactPhone?: string;
	discountPercent: number;
	totalGivenDiscount: number;
	isActive: boolean;
	conexiuniConturi?: ConexiuniConturi[];
	documente?: Documente[];
}
export interface FisiereDocumente {
	id: string;
	fileName?: string;
	fileExtension?: string;
	identifier: string;
	created: Date;
	documenteId?: string;
}
export interface Hybrid {
	id: string;
	name?: string;
	noSubAccounts: number;
	noDocsUploaded: number;
	conexiuniConturi?: ConexiuniConturi[];
	preferinteHybrid?: PreferinteHybrid[];
	isEditMode?: boolean;
}
export interface PreferinteHybrid {
	id: string;
	hybridId?: string;
	conexId?: string;
	conexiuniConturi?: ConexiuniConturi;
}
export interface ProfilCont {
	id: string;
	name?: string;
	firstName?: string;
	email?: string;
	phoneNumber?: string;
	noDocsUploaded: number;
	isBusiness: boolean;
	conexId?: string;
}
export interface Tranzactii {
	id: string;
	type: number;
	typeName?: string;
	amount: number;
	created: Date;
	documenteId?: string;
	conexId?: string;
	documente?: Documente;
}
