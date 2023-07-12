import { Injectable } from '@angular/core';
import {
	CanDeactivate,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { ViewDetailsComponent } from './view-details/view-details.component';

@Injectable({
	providedIn: 'root',
})
export class CanDeactivateViewDetailsComponent
	implements CanDeactivate<ViewDetailsComponent>
{
	canDeactivate(
		component: ViewDetailsComponent,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState: RouterStateSnapshot
	):
		| Observable<boolean | UrlTree>
		| Promise<boolean | UrlTree>
		| boolean
		| UrlTree {
		// Get the next route
		let nextRoute: ActivatedRouteSnapshot = nextState.root;
		while (nextRoute.firstChild) {
			nextRoute = nextRoute.firstChild;
		}

		// If the next state doesn't contain '/file-manager'
		// it means we are navigating away from the
		// file manager app
		if (!nextState.url.includes('firme-platforma')) {
			// Let it navigate
			return true;
		}
		// If we are navigating to another item...
		if (nextState.url.includes('/view-details')) {
			// Just navigate
			return true;
		}
		// Otherwise...
		else {
			// Close the drawer first, and then navigate
			return component.closeDrawer().then(() => true);
		}
	}
}
