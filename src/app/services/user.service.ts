import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encryption.service';
import { P } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, switchMap } from 'rxjs';



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

 cashInEntry(userId: any, bookName: any, data: any) : Observable<any>{
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    switchMap((user: any) => {
      // find the book and update
      const updatedBook = user.books.map((book: any) => {
        if(book.bookTitle == bookName){
          // add new entry to  book
          const updatedBook = {
            ...book,
            cashInEntries: [...(book.cashInEntries ||  []) , data]
          }
          // calculate the cashInTotal
          const cashInTotal = (updatedBook.cashInEntries || [])
                          .reduce((sum:number, entry: any) => sum+ parseFloat(entry.amount),0 )

          return {
            ...updatedBook, 
            cashInTotal: cashInTotal
          }
        }
        return book
      })

      // update the user with the modified books
      return this.http.patch(`${this.url}/users/${userId}`, {books: updatedBook})
    })
  )
 }

 cashOutEntry(userId:any, bookName: any, data: any): Observable<any>{
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    switchMap((user: any) => {
      const updatedBooks = user.books.map((book: any) => {
        if(book.bookTitle == bookName){
          const updatedBooks = {
            ...book,
            cashOutEntries: [...(book.cashOutEntries || []), data]
          }
          const cashOutTotal = (updatedBooks.cashOutEntries || [])
                                .reduce((sum: number, entry: any) => sum+ parseFloat(entry.amount) , 0)
          return {
            ...updatedBooks,
            cashOutTotal: cashOutTotal
          }
        }
        return book
      })
      return this.http.patch(`${this.url}/users/${userId}`, {books: updatedBooks})
    })
  )
 }

entriesTable(userId: any, bookName: any){
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    map((user: any) => {
      const book = user.books.find((b: any) => b.bookTitle == bookName)
      if(book){
        const cashInEntries = book.cashInEntries || []
        const cashOutEntries = book.cashOutEntries || []
        const combinedEntries = [...cashInEntries, ...cashOutEntries]
        combinedEntries.sort((a: any, b: any) => {
          const dateTimeA = this.parseDateTime(a.date, a.time);
          const dateTimeB = this.parseDateTime(b.date, b.time)
          return dateTimeB.getTime() - dateTimeA.getTime()
        })
        //Add a type properties to distinguish entries
        return combinedEntries.map(entry => ({
          ...entry,
          type: cashInEntries.includes(entry)? 'cash-in':'cash-out'
        }))
      }
      return []
    })
  )
}

parseDateTime(date: string, time: string):Date{
  return new Date(`${date} ${time}`)
}


updateCashInEntry(userId: any, bookName: any, data: any): Observable<any> {
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    switchMap((user: any) => {
      // Find the book and update it
      const updatedBooks = user.books.map((book: any) => {
        if (book.bookTitle === bookName) {
          console.log("Data in Service: ", data);
          
          const updatedCashInEntries = book.cashInEntries.map((entry: any) => {
            console.log("Data in Service: ", data);
            console.log("Actual Data: ", entry);
            if (
              entry.date === data.date &&
              entry.time === data.time
            ) {
              console.log("MATCHED");
              // Update the matched entry
              const cashInTotal = (book.cashInEntries || []).reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);
              return { ...entry, ...data , cashInTotal: cashInTotal};
              
          
            }
            
            return entry;
          });

          // Calculate the new cashOutTotal
          const cashInTotal = updatedCashInEntries.reduce(
            (sum: number, entry: any) => sum + parseFloat(entry.amount),
            0
          );

          return {
            ...book,
            cashInEntries: updatedCashInEntries,
            cashInTotal: cashInTotal, // Update the total
          };
        }
        return book;
      });

      // Update the user with the modified books
      return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
    })
  );
}

updateCashOutEntry(userId: any, bookName: any, data: any): Observable<any> {
  return this.http.get(`${this.url}/users/${userId}`).pipe(
    switchMap((user: any) => {
      // Find the book and update it
      const updatedBooks = user.books.map((book: any) => {
        if (book.bookTitle === bookName) {
          console.log("Data in Service: ", data);
          
          const updatedCashOutEntries = book.cashOutEntries.map((entry: any) => {
            console.log("Data in Service: ", data);
            console.log("Actual Data: ", entry);
            if (
              entry.date === data.date &&
              entry.time === data.time
            ) {
              console.log("MATCHED");
              // Update the matched entry
              const cashOutTotal = (book.cashOutEntries || []).reduce((sum: number, entry: any) => sum + parseFloat(entry.amount), 0);
               return { ...entry, ...data , cashOutTotal: cashOutTotal};
            
          
            }
            
            return entry;
          });

          // Calculate the new cashOutTotal
          const cashOutTotal = updatedCashOutEntries.reduce(
            (sum: number, entry: any) => sum + parseFloat(entry.amount),
            0
          );

          return {
            ...book,
            cashOutEntries: updatedCashOutEntries,
            cashOutTotal: cashOutTotal, // Update the total
          };
        }
        return book;
      });

      // Update the user with the modified books
      return this.http.patch(`${this.url}/users/${userId}`, { books: updatedBooks });
    })
  );
}
}