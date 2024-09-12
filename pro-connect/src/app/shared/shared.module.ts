import { NgModule } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SidenavMapComponent } from './components/sidenav/sidenav.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { PostCardComponent } from './components/post-card/post-card.component';
import { MarkdownModule } from 'ngx-markdown';
import { GroupByPipe } from './pipes/notsGroupByDate.pipe';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MatSliderModule } from '@angular/material/slider';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    MatSliderModule,
    MatSlideToggleModule,
    CdkDropList,
    OverlayPanelModule,
    NgFor,
    CdkDrag,
    MatTabsModule,
    LMarkdownEditorModule,
    MatTooltipModule,
    ImageModule,
    TimelineModule,
    CardModule,
    GalleriaModule,
    NgApexchartsModule,
    MarkdownModule.forRoot(),
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    HeaderComponent,
    MatSidenavModule,
    MatCardModule,
    SidenavMapComponent,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatChipsModule,
    MatBadgeModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatSliderModule,
    MatMenuModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTabsModule,
    LMarkdownEditorModule,
    TimelineModule,
    CardModule,
    OverlayPanelModule,
    CdkDropList,
    NgFor,
    CdkDrag,
    MatTooltipModule,
    GalleriaModule,
    ImageModule,
    PostCardComponent,
    NgApexchartsModule,
    GroupByPipe,
  ],
  declarations: [
    HeaderComponent,
    SidenavMapComponent,
    PostCardComponent,
    GroupByPipe,
  ],
})
export class SharedModule {}
