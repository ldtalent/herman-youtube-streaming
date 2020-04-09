import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingRoutes } from './home.routing';
import { MaterialModule } from '../material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewPlaylistComponent } from './newPlaylist/newPlaylist.component';
import { UploadVideoComponent } from './upload-video/upload-video.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingRoutes
  ],
  declarations: [HomeComponent, NewPlaylistComponent, UploadVideoComponent]
})
export class HomeModule { }
