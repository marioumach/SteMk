import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../app.component';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-DArticle',
    templateUrl: './DArticle.component.html'
})
export class DArticleComponent implements OnInit {
    hide = true;
    article : any;
    codeVerif : string = "" ;
    password = "55413494"
    constructor( public dialogRef: MatDialogRef <DArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService : ShareService) { 
            this.article = data;
            console.log(data.key);
        }

    ngOnInit(): void { }
    onDelete(){
        if (this.codeVerif===this.password){
            this.shareService.deleteArticle(this.article.key).then(()=>{
                this.shareService.showMsg("Article supprimé avec succès");
              })
              .catch(error => {
                console.error(error.message);
                this.shareService.showMsg(error.message)
              })
              this.dialogRef.close();

        }
        else {
            this.shareService.showMsg("Code de Confirmation Incorrecte");

        }}
    
    onNoClick(): void {
        this.dialogRef.close();
      }
}
