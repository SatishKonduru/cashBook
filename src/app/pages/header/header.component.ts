import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, inject, OnInit, signal } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    MatMenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  preserveWhitespaces: true
})
export class HeaderComponent implements OnInit, AfterViewChecked{

  private _user = inject(UserService)
  private _router = inject(Router)

  public username = signal('')

  ngOnInit(): void {
    this.getUser()
  }

  ngAfterViewChecked(): void {
    this.getUser()
  }

  getUser(){
    const user = sessionStorage.getItem('userCredentials')
    if(user){
      const userDetails = this._user.retrieveCredentials().username
      this.username.update(username => username = userDetails )
    }
  }


  logout(){
    sessionStorage.removeItem('userCredentials')
    this.username.update(u => u='')
    this._router.navigate(['/'])
  }

}
