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
import { FuseAlertModule } from '@fuse/components/alert';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

@NgModule({
	declarations: [
		FileManagerComponent,
		FileManagerDetailsComponent,
		FileManagerListComponent,
	],
	imports: [
		RouterModule.forChild(fileManagerRoutes),
		FuseAlertModule,
		MatDialogModule,
		MatSidenavModule,
		MatTooltipModule,
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatPaginatorModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		SharedModule,
	],
})
export class FileManagerModule {}
