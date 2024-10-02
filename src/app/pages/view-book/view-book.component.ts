import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';

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
              MatDividerModule
            ],
  templateUrl: './view-book.component.html',
  styleUrl: './view-book.component.css',
  preserveWhitespaces: true
})
export class ViewBookComponent {
activatedRoute = inject(ActivatedRoute)
bookName: any = ''
searchKey : any = ''
router = inject(Router)
constructor(){
  this.activatedRoute.queryParams.subscribe(p => this.bookName = p['book'])
  
}


goBack(){
this.router.navigate(['/dashboard'])
}


toggleDrawerForCashIn(){

}

toggleDrawerForCashOut(){

}


}
