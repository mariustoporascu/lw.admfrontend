import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'file-manager',
	templateUrl: './file-manager.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent implements OnInit {
	baseRoute: string = 'filemanager';
	/**
	 * Constructor
	 */
	constructor(private _activatedRoute: ActivatedRoute) {}
	ngOnInit(): void {
		this.baseRoute = this._activatedRoute.snapshot.data.baseRoute;
	}
}
