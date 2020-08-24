import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DArticleComponent } from './DArticle.component';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-DMouvement',
    templateUrl: './DMouvement.component.html'})
export class DMouvementComponent implements OnInit {
    codeVerif : string = "" ;
    password = "55413494";
    mouvement : any ;
    hide = true;
    constructor(public dialogRef: MatDialogRef <DArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService : ShareService) { 
            this.mouvement = data;
        }

    ngOnInit(): void { }
    onDelete(){
        if (this.codeVerif===this.password){
            let q =0
            var article : any
            this.shareService.getArticle(this.mouvement.article).subscribe((a :any) => {
                console.log(a)
                article= a.payload.val()
                console.log(article)

            }).unsubscribe()
                console.log(article)
               q= article.quantite;
               console.log(q)
                console.log(this.mouvement.quantite)
               q-=this.mouvement.quantite
               console.log(q)
            this.shareService.deleteMouvement(this.mouvement.key).then(()=>{
                this.shareService.updateArticleQte(this.mouvement.article,q)
                this.shareService.showMsg("Mouvement supprimé avec succès");
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
