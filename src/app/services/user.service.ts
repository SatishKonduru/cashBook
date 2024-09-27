import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  public url = environment.apiURL // localhost:3000
  public http = inject(HttpClient)

  userRegister(data: any){
  return  this.http.post<any>(`${this.url}/users`, data)
  }

}
