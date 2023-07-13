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
import { MasterDashComponent } from './master-dash.component';
import { masterDashRoutes } from './master-dash.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { NgChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	declarations: [MasterDashComponent],
	imports: [
		RouterModule.forChild(masterDashRoutes),
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatPaginatorModule,
		MatTooltipModule,
		MatInputModule,
		NgChartsModule,
		SharedModule,
	],
})
export class MasterDashModule {}
