import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCalendar, MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-edit-transaction',
  standalone: true,
  imports: [
          CommonModule, 
          MatDialogModule,
          MatToolbarModule,
          MatButtonModule,
          MatIconModule,
          MatDividerModule,
          ReactiveFormsModule,
          MatFormFieldModule,
          MatInputModule,
          MatDatepickerModule,
          MatCalendar
        ],
  templateUrl: './edit-transaction.component.html',
  styleUrl: './edit-transaction.component.css'
})
export class EditTransactionComponent implements OnInit{

  transactionData : any = {}
  bookName : any
  userId: any
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any){
    console.log("Dialog Data: ", dialogData)
     this.transactionData = dialogData.data
    this.bookName = dialogData.bookName
    this.userId = dialogData.userId

  }
  editForm : any = FormGroup
  formBuilder = inject(FormBuilder)
  ngOnInit(): void {
    console.log("Transaction Data: ", this.transactionData)
    // Convert the date string into a Date Object
    const dateParts = this.transactionData.date.split('/') // dateParts = ['10','03','2024']
    console.log("Splitted Date parts: ", dateParts)
    const formattedDate = new Date(+dateParts[2], +dateParts[0]-1, +dateParts[1])

    this.editForm = this.formBuilder.group({
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      amount: [0, Validators.required],
      description: ['', Validators.required]
    })

    this.editForm.patchValue({
      date: formattedDate,
      time: this.transactionData.time,
      amount: this.transactionData.amount,
      description: this.transactionData.description
    })
  }

  updateTransaction(){
    
  }

}
