import {  MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheetModule  } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ScrollingModule } from '@angular/cdk/scrolling';

const modules = [
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatBottomSheetModule,
    MatIconModule,
    MatTabsModule,
    MatSelectModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    ScrollingModule,
    FlexLayoutModule
];


@NgModule({
    declarations: [],
    imports: modules,
    exports: modules
})
export class MaterialModule { }
