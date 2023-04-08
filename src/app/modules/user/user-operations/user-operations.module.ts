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

@NgModule({
	declarations: [UserOperationsComponent],
	imports: [
		RouterModule.forChild(userOperationsRoutes),
		MatButtonModule,
		MatDividerModule,
		MatIconModule,
		MatMenuModule,
		MatProgressBarModule,
		MatSortModule,
		MatTableModule,
		MatPaginatorModule,
		MatInputModule,
		SharedModule,
	],
})
export class UserOperationsModule {}
