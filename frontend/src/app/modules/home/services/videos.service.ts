import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Subject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  playlists$ = new ReplaySubject<any>(1);

  constructor(private http: HttpClient) { }

  playlists = () => this.http.get<any>(`${environment.apiBaseUrl}/playlists`).pipe(
    map(({items}) => items.map(playlist => this.transformPlaylist(playlist) )),
    tap(data => this.playlists$.next(data))
  )

  playlistItems = (id: string) => this.http.get<any>(`${environment.apiBaseUrl}/playlists/${id}`);

  transformPlaylist = playlist => {
    const newPlay = playlist;
    this.playlistItems(playlist.id).subscribe(({items}) => newPlay.items = items);

    return newPlay;
  }

  createPlaylist = data => this.http.post(`${environment.apiBaseUrl}/playlists`, data);

  uploadVideo = file => {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'multipart/form-data');

    const formData: FormData = new FormData();
    formData.append('fileKey', file, file.name);

    return this.http.post<any>(`${environment.apiBaseUrl}/upload`, formData, { headers });
  };

  addVideoToPlaylist = (video, playlistId) => this.http.post<any>(`${environment.apiBaseUrl}/playlists/${playlistId}`, video);
}
