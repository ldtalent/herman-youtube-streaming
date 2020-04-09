import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login = (): Observable<any> =>  this.http.get(`${environment.apiBaseUrl}/authorize`);

  authenticate = (code: string) => this.http.get(`${environment.apiBaseUrl}/auth?code=${code}`);

}
