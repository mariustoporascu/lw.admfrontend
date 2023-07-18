import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'app/shared/shared.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { MatDialogModule } from '@angular/material/dialog';
import { MasterFirmaFormComponent } from './master-firma-form.component';
import { masterFirmaFormRoutes } from './master-firma-form.routing';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
	declarations: [MasterFirmaFormComponent],
	imports: [
		RouterModule.forChild(masterFirmaFormRoutes),
		FuseAlertModule,
		MatButtonModule,
		MatDividerModule,
		MatCheckboxModule,
		MatDialogModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatAutocompleteModule,
		MatSortModule,
		MatTooltipModule,
		MatTableModule,
		MatPaginatorModule,
		MatSidenavModule,
		MatSelectModule,
		MatInputModule,
		MatDatepickerModule,
		NgxExtendedPdfViewerModule,
		MatNativeDateModule,
		SharedModule,
	],
})
export class MasterFirmaFormModule {}
