import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import { ToastrService } from 'ngx-toastr';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatCalendar } from '@angular/material/datepicker';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
@Component({
  selector: 'app-view-book',
  standalone: true,
  imports: [
              CommonModule,
              MatButtonModule,
              MatIconModule,
              MatTooltipModule,
              MatFormFieldModule,
              MatInputModule,
              FormsModule,
              MatDividerModule,
              MatToolbarModule,
              ReactiveFormsModule,
              MatCalendar,
              MatDatepickerModule,
              NgxMaterialTimepickerModule
            ],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true,
  providers: [DatePipe]
})
export class ViewBookComponent implements OnInit{
activatedRoute = inject(ActivatedRoute)
bookName: any = ''
searchKey : any = ''
router = inject(Router)
isDrawerOpen = false
addForm : any = FormGroup
fb = inject(FormBuilder)
userId : any
toastr = inject(ToastrService)
title : any
entryCode = 0
cashInMoney : number
cashOutMoney : number
datePipe = inject(DatePipe)

constructor(){
  this.activatedRoute.queryParams.subscribe(p => this.bookName = p['book'])
  
}

ngOnInit(): void {
  const currentTime = new Date().toLocaleTimeString('en-us', {hour: '2-digit', minute: '2-digit', hour12: true})
  this.addForm = this.fb.group({
    date: [new Date(), Validators.required],
    time: [currentTime, Validators.required],
    amount: [0, Validators.required],
    description: ['', Validators.required]
  })
}
goBack(){
this.router.navigate(['/dashboard'])
}


toggleDrawerForCashIn(){
  this.isDrawerOpen = !this.isDrawerOpen
  this.title = 'Add Entry for CASH IN'
  this.entryCode = 1
}

toggleDrawerForCashOut(){
  this.isDrawerOpen = !this.isDrawerOpen
  this.title = 'Add Entry for CASH OUT'
  this.entryCode = 2
}

toggleDrawer(){
  this.isDrawerOpen = !this.isDrawerOpen
}

}
