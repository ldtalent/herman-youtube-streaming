import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  playlists$ = new Subject<any>();

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

}
