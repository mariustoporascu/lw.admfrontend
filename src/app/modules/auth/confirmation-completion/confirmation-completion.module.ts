import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthConfirmationCompletionComponent } from 'app/modules/auth/confirmation-completion/confirmation-completion.component';
import { authConfirmationCompletionRoutes } from 'app/modules/auth/confirmation-completion/confirmation-completion.routing';

@NgModule({
	declarations: [AuthConfirmationCompletionComponent],
	imports: [
		RouterModule.forChild(authConfirmationCompletionRoutes),
		MatButtonModule,
		FuseCardModule,
		SharedModule,
	],
})
export class AuthConfirmationCompletionModule {}
