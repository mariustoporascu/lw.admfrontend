import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';

@Component({
	selector: 'firma-ext-usrs',
	templateUrl: './firma-ext-usrs.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirmaExternalUsersComponent implements OnInit {
	constructor() {}
	ngOnInit(): void {}
}
