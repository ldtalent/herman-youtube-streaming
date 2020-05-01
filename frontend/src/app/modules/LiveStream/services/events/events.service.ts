import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

constructor(private http: HttpClient) { }

createEvent = event => {
  // this._newBroadcast()
  //  this.http.post(`${environment}/live/broadcast`, event)
}

allEvents = () => this.http.get(`${environment.apiBaseUrl}/live/broadcasts`);

private _newBroadcast = broadcast => this.http.post(`${environment}/live/broadcast`, broadcast);

createStream = stream => this.http.post(`${environment}/live/broadcast`, stream)

}
