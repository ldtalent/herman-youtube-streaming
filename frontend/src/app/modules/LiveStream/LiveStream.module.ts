import { MaterialModule } from './../material/index';
import { NewEventComponent } from './newEvent/newEvent.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveStreamComponent } from './LiveStream.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LiveStreamRoutingRoutes } from './livestream.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    LiveStreamRoutingRoutes
  ],
  declarations: [LiveStreamComponent, NewEventComponent],
})
export class LiveStreamModule { }
