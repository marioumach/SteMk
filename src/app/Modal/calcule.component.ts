import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  prix: 3300 ;
  article: 'Safia';
}
@Component({
    selector: 'app-calcule',
    templateUrl: './calcule.component.html',
})
export class CalculeComponent {
    mainText = 0;
    str : String ;

    constructor(
        public dialogRef: MatDialogRef <CalculeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    
      onDelete(): void {
          this.mainText = Number(this.mainText.toString().slice(0, -1))
          console.log(this.mainText)
      }
      onNoClick():void{
         this.dialogRef.close();

      }
      pressKey(key: string) {
            this.str =  this.mainText.toString() + key;
            this.mainText = Number(this.str)
      }

}
