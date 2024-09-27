import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { globalProperties } from '../../shared/globalProperties';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
 
  registerForm : any = FormGroup
  formBuilder = inject(FormBuilder)
  private _userService = inject(UserService)
  private _toastrService = inject(ToastrService)
  private _router = inject(Router)
 
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(globalProperties.nameRegx)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onRegister(){
    const formData = this.registerForm.value
    console.log("Form Data: ", formData)
    this._userService.userRegister(formData).subscribe({
      next: (res: any) => {
        this._toastrService.success('Registration Successful','Success', globalProperties.toastrConfig)
        this._router.navigate(['/login'])
      },
      error: (err: any) => {
        this._toastrService.error('Registraion Faild','Fail', globalProperties.toastrConfig)
        this.registerForm.reset()
      }
    })
  }

}
