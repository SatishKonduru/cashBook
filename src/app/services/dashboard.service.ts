import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiURL
  http = inject(HttpClient)
 
  addNewBook(userId: string, bookName: string){
  return  this.http.patch(`${this.url}/users/${userId}`, {books: {title: bookName}})
  }


}
