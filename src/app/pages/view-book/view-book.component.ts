import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { UserService } from '../../services/user.service';
import { globalProperties } from '../../shared/globalProperties';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditTransactionComponent } from '../edit-transaction/edit-transaction.component';

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
              NgxMaterialTimepickerModule,
              MatTableModule,
              MatPaginatorModule
            ],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true,
  providers: [DatePipe]
})
export class ViewBookComponent implements OnInit, AfterViewInit{
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
userService = inject(UserService)
entries : any
displayedColumns : string [] = ['date', 'time', 'description', 'amount', 'actions']
dialog = inject(MatDialog)

@ViewChild(MatPaginator) paginator : MatPaginator
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

  this.getTotals()
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
  this.resetForm()
}

async save(){
  const formData = this.addForm.value
  const transactionDate = this.datePipe.transform(formData.date, 'MM/dd/YYYY')
  const data = {
    date: transactionDate,
    time: formData.time,
    amount: formData.amount,
    description: formData.description
  }
  let userDetails = this.userService.retrieveCredentials()
  await this.userService.getUsers().subscribe({
    next: (res: any) => {
      res.find(obj => {
        if(obj.username == userDetails.username && obj.password == userDetails.password){
          this.userId = obj.id
        }
      })
      if(this.entryCode == 1){
        this.userService.cashInEntry(this.userId, this.bookName, data).subscribe({
          next: (res: any) => {
            this.toastr.success('Entry added successfully.','Success', globalProperties.toastrConfig)
            this.getTotals()
            this.resetForm()
            this.toggleDrawer()
            this.getEntriesTable()
          }
        })
      }
      if(this.entryCode == 2){
        this.userService.cashOutEntry(this.userId, this.bookName, data).subscribe({
          next: (res: any) => {
            this.toastr.success('Entry added successfully.','Success', globalProperties.toastrConfig)
            this.getTotals()
            this.resetForm()
            this.toggleDrawer()
            this.getEntriesTable()
          }
        })
      }
    },
    error: () => {
      this.toastr.error('No Entry was Added.', 'Fail', globalProperties.toastrConfig)
    }

  })
}


resetForm(){
  const initailTime = new Date().toLocaleTimeString('en-us', {hour: '2-digit', minute:'2-digit', hour12:true})
  this.addForm.setValue({
    date: new Date(),
    time: initailTime,
    amount: 0,
    description: ''
  })
}

getTotals(){
  let userDetails = this.userService.retrieveCredentials()
  this.userService.getUsers().subscribe({
    next: (res: any) => {
      res.find(obj => {
        if(obj.username == userDetails.username && obj.password == userDetails.password){
          obj.books.forEach( (obj:any) => {
            if(obj.bookTitle == this.bookName){
              this.cashInMoney = obj.cashInTotal
              this.cashOutMoney = obj.cashOutTotal
            }
          })
        }
      })
    }
  })
}


getEntriesTable(){
  let userDetails = this.userService.retrieveCredentials()
  this.userService.getUsers().subscribe({
    next: (res: any) => {
      res.find(obj => {
        if(obj.username == userDetails.username && obj.password == userDetails.password){
          this.userId = obj.id
        }
      })
      this.userService.entriesTable(this.userId, this.bookName).subscribe({
        next: (entries: any[]) => {
          this.entries = new MatTableDataSource(entries)
          this.entries.paginator = this.paginator
        } 
      })
    }

  })
}

get hasEntries() : boolean {
return this.entries?.data.length > 0
}

ngAfterViewInit(): void {
  this.getEntriesTable()
}


applyFilter(value: any){
  this.entries.filter = value.trim().toLowerCase()
}

onSearchClear(){
  this.searchKey = ''
  this.applyFilter('')
}

onEdit(data: any){
console.log("Selected Transaction Data: ", data)

const dialogConfig = new MatDialogConfig()
dialogConfig.width = '500px'
dialogConfig.autoFocus = true
dialogConfig.disableClose = true
dialogConfig.data = {
  data: data,
  userId: this.userId,
  bookName: this.bookName
}
const dialogRef = this.dialog.open(EditTransactionComponent, dialogConfig)
dialogRef.componentInstance.emitter.subscribe({
  next: () => {
    this.getEntriesTable()
    this.getTotals()
  }
})

}


onDelete(data: any){
this.userService.deleteEntry(this.userId, this.bookName, data.type, data.date, data.time).subscribe({
  next: () => {
    this.toastr.success('Transaction Deleted Successfully', 'Success', globalProperties.toastrConfig)
    this.getEntriesTable()
    this.getTotals()
  }
})
}


}
