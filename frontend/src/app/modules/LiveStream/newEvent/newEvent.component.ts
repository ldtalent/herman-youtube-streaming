import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgForm } from '@angular/forms';
import { EventsService } from '../services/events/events.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-newevent',
  template: `
  <mat-horizontal-stepper [linear]="isLinear" #stepper>
  <mat-step>
    <form
#formData="ngForm"
fxLayout="column"
fxLayoutGap="15px"
(ngSubmit)="createEvent(formData)"
>
<ng-template matStepLabel>New Broadcast</ng-template>

<mat-form-field>
  <input
    class="form-control"
    matInput
    placeholder="Event title"
    name="title"
    ngModel
  />
</mat-form-field>
<mat-form-field>
  <textarea
    class="form-control"
    matInput
    name="description"
    cols="30"
    rows="5"
    placeholder="Type some description..."
    ngModel
  ></textarea>
</mat-form-field>

<label for="scheduledStartTime">Start time: 
<mat-form-field>
  <input
    class="form-control"
    matInput
    type="date"
    name="scheduledStartTime"
    ngModel
  />
</mat-form-field>
</label>

<label for="scheduledEndTime">End time:
<mat-form-field>
  <input
    class="form-control"
    matInput
    type="date"
    name="scheduledEndTime"
    ngModel
  />
</mat-form-field>
</label>

<mat-select
  class="larger"
  placeholder="Select privacy status"
  ngModel
  name="privacyStatus"
>
  <mat-option *ngFor="let status of privacy" [value]="status">
    {{ status | titlecase }}
  </mat-option>
</mat-select>

<button class="larger" mat-button [style.background]="'warn'" matStepperNext>
  Next
</button>
</form>
  </mat-step>

  <mat-step>
  <form
  #formData="ngForm"
  fxLayout="column"
  fxLayoutGap="15px"
  (ngSubmit)="createEvent(formData)"
  >
  <ng-template matStepLabel>Broadcast stream</ng-template>
  
  <mat-form-field>
    <input
      class="form-control"
      matInput
      placeholder="Stream title"
      name="title"
      ngModel
    />
  </mat-form-field>
  
  <mat-select
    class="larger"
    placeholder="Select ingestion type"
    ngModel
    name="ingestionType"
  >
    <mat-option *ngFor="let ingestionType of ingestionTypes" [value]="ingestionType">
      {{ ingestionType | titlecase }}
    </mat-option>
  </mat-select>

  <mat-select
    class="larger"
    placeholder="Select resolution"
    ngModel
    name="resolution"
  >
    <mat-option *ngFor="let resolution of resolutions" [value]="resolution">
      {{ resolution | titlecase }}
    </mat-option>
  </mat-select>

  <mat-select
    class="larger"
    placeholder="Select framerate"
    ngModel
    name="frameRate"
  >
    <mat-option *ngFor="let framerate of framerates" [value]="framerate">
      {{ framerate | titlecase }}
    </mat-option>
  </mat-select>
  
  <button class="larger" mat-button [style.background]="'warn'">
    Create Event
  </button>
  </form>
  </mat-step>
</mat-horizontal-stepper>

  `,
  styles: [`
  form {
    margin-bottom: 20px;
  }

  .form-control {
    background-color: rgba(128, 128, 128, 0.096);
    font-size: medium;
  }

  .larger {
    height: 60px;
  }

  button {
    background-color: #e55036;
  }
  `]
})
export class NewEventComponent implements OnInit {
  privacy = ['private', 'public'];
  ingestionTypes = [
    'dash',
    'hls',
    'rtmp'
  ];
  resolutions = [
    '240p',
'360p',
'480p',
'720p',
'1080p',
'1440p',
'2160p',
'variable'
  ];
  framerates = [
    '30fps',
'60fps',
'variable'
  ];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  eventTags = [];

  isLinear = false;

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<NewEventComponent>,
    private videosService: EventsService) { }

  ngOnInit() {
    
  }

  closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.eventTags.push({ name: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.eventTags.indexOf(fruit);

    if (index >= 0) {
      this.eventTags.splice(index, 1);
    }
  }

  createEvent = (form: NgForm) => {
    // this.videosService.createEvent({...form.value, tags: this.EventTags}).subscribe(res => {
    //   this.videosService.Events().subscribe();
    //   this.closeSheet();
    // });
  }

}
