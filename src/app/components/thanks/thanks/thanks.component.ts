import { Component, inject } from '@angular/core';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-thanks',
  imports: [MatDialogContent],
  templateUrl: './thanks.component.html',
  styleUrl: './thanks.component.css'
})
export class ThanksComponent {
 dialogRef = inject(MatDialogRef<ThanksComponent>)

 closeDialog(){
  this.dialogRef.close();
 }
}
