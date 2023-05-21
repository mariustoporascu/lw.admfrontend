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
import { UserOperationsComponent } from './user-operations.component';
import { userOperationsRoutes } from './user-operations.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SearchForUserComponent } from './search-user/search-user.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ViewDocumentComponent } from './view-document/view-document.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
	declarations: [
		UserOperationsComponent,
		SearchForUserComponent,
		ViewDocumentComponent,
	],
	imports: [
		RouterModule.forChild(userOperationsRoutes),
		FuseAlertModule,
		MatButtonModule,
		MatDividerModule,
		MatCheckboxModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatAutocompleteModule,
		MatSortModule,
		MatTooltipModule,
		MatTableModule,
		MatPaginatorModule,
		MatSidenavModule,
		MatInputModule,
		MatDatepickerModule,
		MatNativeDateModule,
		NgxExtendedPdfViewerModule,
		SharedModule,
	],
})
export class UserOperationsModule {}
