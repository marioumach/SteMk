import { Component, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from 'src/services/share.service';

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
  article  : any
  PU : number
  constructor(
    public dialogRef: MatDialogRef<CalculeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData ,
    private shareService: ShareService ) {
      this.article = data.article
      console.log(this.article)
      this.PU = this.article.prixVente
      console.log(this.PU)
     }

//   onTouche(event: KeyboardEvent): void {
//     var e = event.key;
// if (e === "Enter") {
//       this.passer()
//     }
//   }
  onDelete(): void {
    this.mainText = Number(this.mainText.toString().slice(0, -1))
    console.log(this.mainText)
  }
  passer(): void {
    if (this.PU > this.article.prixAchat) {
    console.log(this.mainText)
    if(this.mainText===0){
      this.mainText=1
    }
    const obj = {
      article : this.article.key , 
      prixUnit : this.PU ,
      quantite : this.mainText , 
      date :  new Date().toLocaleString()

    }
    
    this.dialogRef.close({data : obj});
} else{
  this.shareService.showMsg("Le prix de vente doit être spérieur au prix d'achat")
}
  }
  pressKey(key: string) {
    this.str = this.mainText.toString() + key;
    this.mainText = Number(this.str)
  }

}
