import { Component, OnInit } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewPlaylistComponent } from './modules/home/newPlaylist/newPlaylist.component';
import { AuthService } from './services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadVideoComponent } from './modules/home/upload-video/upload-video.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private _bottomSheet: MatBottomSheet,
              private authService: AuthService,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(({code}) => {
      if (code) {
            this.authService.authenticate(code).subscribe(() => this.router.navigate(['/']));
          }
    });
  }

  openBottomSheet(): void {
    this._bottomSheet.open(NewPlaylistComponent);
  }
  openVideoUpload(): void {
    this._bottomSheet.open(UploadVideoComponent);
  }

  login = () => this.authService.login().subscribe(({ url }) => window.location = url);

}
