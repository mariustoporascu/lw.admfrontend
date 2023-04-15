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
import { UserDashComponent } from './user-dash.component';
import { userDashRoutes } from './user-dash.routing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
	declarations: [UserDashComponent],
	imports: [
		RouterModule.forChild(userDashRoutes),
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatPaginatorModule,
		MatInputModule,
		NgChartsModule,
		SharedModule,
	],
})
export class UserDashModule {}
