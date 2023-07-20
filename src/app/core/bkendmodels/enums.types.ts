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
export enum TranzactionStatusEnumRO {
	FaraStatus = 0,
	Transferat = 1,
	TransferEsuat = 2,
	Retras = 3,
	RetragereEsuata = 4,
	AsteptarePlata = 5,
	PlataGenerata = 6,
}
