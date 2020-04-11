import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { VideosService } from './services/videos.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  playlists$ = this.videosService.playlists$;
  videoUrl = environment.baseVideoUrl;
  currentVideo;

  constructor(private videosService: VideosService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.videosService.playlists().subscribe();
  }

  playVideo = videoId => {
    const sanitized = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl + videoId);
    this.currentVideo = sanitized;
  };

}
