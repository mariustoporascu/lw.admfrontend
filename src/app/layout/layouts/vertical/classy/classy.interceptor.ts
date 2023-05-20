import { Injectable } from '@angular/core';
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpErrorResponse,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler) {
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				// Handle the error and show a generic error message to the user
				console.log('An error occurred:', error);
				// You can display an error message to the user using a notification service, dialog, or any other means
				return throwError(error.error);
			})
		);
	}
}
