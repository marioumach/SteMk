import { Component, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  prix: 3300;
  article: 'Safia';
}
@Component({
  selector: 'app-calcule',
  templateUrl: './calcule.component.html',
})
export class CalculeComponent {
  mainText = 0;
  str: String;

  constructor(
    public dialogRef: MatDialogRef<CalculeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onTouche(event: KeyboardEvent): void {
    var e = event.key;
    console.log(e)
    if (!isNaN(Number(e))) {
      this.pressKey(e)
    }
    else if (e === "Backspace") {
      console.log('backspaceeee')
      this.onDelete()
    }
    else if (e === "Enter") {
      this.onDelete()

      console.log('Enterrrr')
      this.onNoClick()
    }
  }
  onDelete(): void {
    this.mainText = Number(this.mainText.toString().slice(0, -1))
    console.log(this.mainText)
  }
  onNoClick(): void {
    this.dialogRef.close();

  }
  pressKey(key: string) {
    this.str = this.mainText.toString() + key;
    this.mainText = Number(this.str)
  }

}
