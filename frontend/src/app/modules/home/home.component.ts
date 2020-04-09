import { Component, OnInit } from '@angular/core';
import { VideosService } from './services/videos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  playlists$ = this.videosService.playlists$;

  constructor(private videosService: VideosService) {}

  ngOnInit() {
    this.videosService.playlists().subscribe();
  }

}
