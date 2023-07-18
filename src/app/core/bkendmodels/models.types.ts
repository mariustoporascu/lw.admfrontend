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
	firmaDiscount?: FirmaDiscount;
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
	isActiveSecondary: boolean;
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
export interface FirmaAnafDetails {
	adresa?: string;
	cui?: string;
	scpTVA?: boolean;
	nrRegCom?: string;
	denumire?: string;
}

export enum StatusEnumEN {
	NoStatus = 0,
	Approved = 1,
	Rejected = 2,
	WaitingForApproval = 3,
	Processing = 4,
	CompletedProcessing = 5,
	FailedProcessing = 6,
	PartialyProcessed = 7,
	WaitingForPreApproval = 8,
	DuplicateError = 9,
}
export enum TranzactionTypeEnumEN {
	NoStatus = 0,
	Transfer = 1,
	Withdraw = 2,
}
export enum StatusEnumRO {
	FaraStatus = 0,
	Aprobat = 1,
	Respins = 2,
	AsteptareAprobare = 3,
	Procesare = 4,
	ProcesareCompleta = 5,
	ProcesareEsuata = 6,
	PartialProcesat = 7,
	AsteptarePreAprobare = 8,
	EroareDuplicat = 9,
}
export enum TranzactionTypeEnumRO {
	FaraStatus = 0,
	Transfer = 1,
	Retragere = 2,
}
