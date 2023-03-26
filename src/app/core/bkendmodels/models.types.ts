import { User } from '../user/user.types';

export interface ConexiuniConturi {
	id: string;
	userId?: string;
	hybridId?: string;
	firmaDiscountId?: string;
	ProfilCont?: ProfilCont;
	Tranzactii?: Tranzactii[];
	Documente?: Documente[];
	User?: User;
}
export interface Documente {
	id: string;
	docNumber?: string;
	total: number;
	isInvoice: boolean;
	isApproved: boolean;
	receiptId?: string;
	discountValue: number;
	extractedBusinessData?: string;
	extractedBusinessAddress?: string;
	uploaded: Date;
	firmaDiscountId?: string;
	conexId?: string;
	nextConexId?: string;
	FisiereDocumente?: FisiereDocumente;
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
	ConexiuniConturi?: ConexiuniConturi[];
	Documente?: Documente[];
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
	ConexiuniConturi?: ConexiuniConturi[];
	PreferinteHybrid?: PreferinteHybrid[];
}
export interface PreferinteHybrid {
	id: string;
	hybridId?: string;
	conexId?: string;
	ConexiuniConturi?: ConexiuniConturi;
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
	isWithdraw: boolean;
	amount: number;
	created: Date;
	documenteId?: string;
	conexId?: string;
}
