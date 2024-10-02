import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewBookComponent } from '../new-book/new-book.component';
import { UserService } from '../../services/user.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  
  public dialog = inject(MatDialog) 
  user = inject(UserService)
  books: any = []
  public router = inject(Router)
  
  ngOnInit(): void {
    this.getBooks()
  
  }


  addBook(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.autoFocus = true
    dialogConfig.disableClose = true
    dialogConfig.width = '700px'
    const ref = this.dialog.open(NewBookComponent, dialogConfig)
    ref.componentInstance.emitter.subscribe({
      next: (res: any) => {
        this.getBooks()
      }
    })
  }


  getBooks(){
    const {username, password} = this.user.retrieveCredentials()
    this.user.getUsers().subscribe({
      next: (res: any) => {
        res.forEach(user => {
          if(user.username == username && user.password == password){
            this.books = user.books
            console.log("Books:", this.books)
          }
        })
      },
      error: (err: any) => {
        console.log("Error: ", err)
      }
    })


  }

  viewBook(book: any){
    console.log("Selected Book: ", book)
     this.router.navigate(['/viewBook'], {queryParams: {book: book.bookTitle}})
  }
}
