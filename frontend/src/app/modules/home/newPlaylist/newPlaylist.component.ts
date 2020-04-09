import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { NgForm } from '@angular/forms';
import { VideosService } from '../services/videos.service';


@Component({
  selector: 'app-bottomPopup',
  template: `
  <form
  #formData="ngForm"
  fxLayout="column"
  fxLayoutGap="15px"
  (ngSubmit)="createPlaylist(formData)"
>
  <mat-form-field>
    <input
      class="form-control"
      matInput
      placeholder="Playlist title"
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

  <mat-form-field>
    <mat-chip-list #chipList aria-label="Playlist tags">
      <mat-chip
        *ngFor="let tag of playlistTags"
        [selectable]="selectable"
        [removable]="removable"
        (removed)="remove(tag)"
      >
        {{ tag.name }}
        <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
      </mat-chip>
      <input
        placeholder="New tag..."
        [matChipInputFor]="chipList"
        [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
        [matChipInputAddOnBlur]="addOnBlur"
        (matChipInputTokenEnd)="add($event)"
      />
    </mat-chip-list>
  </mat-form-field>
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

  <button class="larger" mat-button [style.background]="'warn'">
    Create Playlist
  </button>
</form>

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
export class NewPlaylistComponent {
  privacy = [
    'private',
    'unlisted',
    'public'
  ];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  playlistTags = [];

  constructor(private _bottomSheetRef: MatBottomSheetRef<NewPlaylistComponent>, private videosService: VideosService) { }

  closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.playlistTags.push({ name: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.playlistTags.indexOf(fruit);

    if (index >= 0) {
      this.playlistTags.splice(index, 1);
    }
  }

  createPlaylist = (form: NgForm) => {
    this.videosService.createPlaylist({...form.value, tags: this.playlistTags}).subscribe(res => {
      this.videosService.playlists().subscribe();
      this.closeSheet();
    });
  }

}
