import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { NgForm } from '@angular/forms';
import { VideosService } from '../services/videos.service';
import { readURL } from 'src/app/utils';

@Component({
  selector: 'app-upload-video',
  template: `
  <form
  #formData="ngForm"
  fxLayout="column"
  fxLayoutGap="15px"
  (ngSubmit)="addVideoToPlaylist(formData)"
>
<div class="profile-pic">
  <div class="middle">
    <label class="custom-file-upload">
      <input id="file" (click)="readURL(uploadVideo)($event)" id="preview-pic" type="file" />
      Select video to upload
    </label>
  </div>
</div>
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

  <mat-select
    class="larger"
    placeholder="Select playlist"
    ngModel
    name="playlistId"
  >
    <mat-option *ngFor="let playlist of playlists$ | async" [value]="playlist.id">
      {{ playlist.title | titlecase }}
    </mat-option>
  </mat-select>

  <button class="larger" mat-button [style.background]="'warn'">
    Upload video
  </button>
</form>
  `,
  styles: [
    `form {
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

    input[type=file] {
      display: none;
    }

    .custom-file-upload {
      display: inline-block;
      padding: 10px 15px;
      color: white;
      cursor: pointer;
      background-color: #e55036;
      filter: saturate(200%);
      width: 95%;
      font-size: medium;
    }

    .profile-pic .middle {
      opacity: 1;
    }

    .middle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      text-align: center;
    }

    .profile-pic {
      position: relative;
      padding-bottom: 25px;
    }

    .profile-pic, .middle {
      width: 100%;
    }
    `
  ],
})
export class UploadVideoComponent {
  privacy = [
    'private',
    'unlisted',
    'public'
  ];
  playlists$ = this.videosService.playlists$;
  readURL = readURL;
  filePath;

  constructor(private _bottomSheetRef: MatBottomSheetRef < UploadVideoComponent >, private videosService: VideosService) { }

  closeSheet(): void {
    this._bottomSheetRef.dismiss();
  }

  uploadVideo = file => this.videosService.uploadVideo(file).subscribe(({filePath}) => this.filePath = filePath);

  addVideoToPlaylist = (form: NgForm) => {
    const { playlistId, ...video} = form.value;
    this.videosService.addVideoToPlaylist({...video, filePath: this.filePath}, playlistId).subscribe(res => {
      this.videosService.playlists().subscribe();
      this.closeSheet();
    });
  }

}
