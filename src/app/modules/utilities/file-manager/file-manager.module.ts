import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/shared/shared.module';
import { FileManagerDetailsComponent } from './details/details.component';
import { FileManagerComponent } from './file-manager.component';
import { fileManagerRoutes } from './file-manager.routing';
import { FileManagerListComponent } from './list/list.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
	declarations: [
		FileManagerComponent,
		FileManagerDetailsComponent,
		FileManagerListComponent,
	],
	imports: [
		RouterModule.forChild(fileManagerRoutes),
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
		MatSidenavModule,
		MatTooltipModule,
		SharedModule,
	],
})
export class FileManagerModule {}
