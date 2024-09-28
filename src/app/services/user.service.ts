import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { P } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }
  public url = environment.apiURL // localhost:3000
  public http = inject(HttpClient)
  private _encryption = inject(EncryptionService)


  userRegister(data: any){
  return  this.http.post<any>(`${this.url}/users`, data)
  }

  storeCredentials(username: string, password: string){
   const combinedCredentials = `${username}:${password}`
  const encryptedData = this._encryption.encrypt(combinedCredentials)
  sessionStorage.setItem('userCredentials',encryptedData)
  }

  retrieveCredentials():{username: string, password: string} | null{
    const encryptedData =  sessionStorage.getItem('userCredentials')
    if(encryptedData){
      const decryptedData = this._encryption.decrypt(encryptedData)
      const [username, password] = decryptedData.split(':')
      return {username, password}  
      
    }
    else null
  }

  getUsers(){
  return  this.http.get<any>(`${this.url}/users`)
  }


}
