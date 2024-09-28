import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { globalProperties } from '../../shared/globalProperties';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  loginForm: any = FormGroup
  form_builder = inject(FormBuilder)
  private _user = inject(UserService)
  private _router = inject(Router)
  private _toastr = inject(ToastrService)

ngOnInit(): void {
  this.loginForm = this.form_builder.group({
    username: ['', [Validators.required, Validators.pattern(globalProperties.nameRegx)]],
    password: ['', Validators.required]
  })
}

onLogin(){
  const formData = this.loginForm.value
  const username = formData.username
  const password = formData.password

  console.log("Username: ", username)
  console.log("Password: ", password)

  this._user.getUsers().subscribe({
    next: (res: any) => {
      // console.log("res", res)
      let validUser = res.find(user => user.username == username && user.password == password)
      if(validUser){
          this._user.storeCredentials(username, password)
         this._toastr.success('Welcome to Cashbook','Success', globalProperties.toastrConfig)
         this._router.navigate(['/dashboard'])
      }
      else{
        this._toastr.error('Invalid Login Credentials','Login Fail', globalProperties.toastrConfig)
        this.loginForm.reset()
      }
    },
   error: (err: any) => {
      console.log("Error: ", err)
   }
  })
}

}
