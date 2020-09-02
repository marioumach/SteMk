import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-DVente',
    templateUrl: './DVente.component.html'})
export class DVenteComponent implements OnInit {
    codeVerif : string = "" ;
    password = "55413494";
    articles : any ;
    key : any ;
    hide = true;
    constructor(public dialogRef: MatDialogRef <DVenteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService : ShareService) { 
            this.key = data.key;
            this.articles = data.articles;
        }
        table () {
            let v : any[]
            let i = 0
            v = this.articles
            const V = Object.values(v)
            return V
            console.log(V)
          }
    ngOnInit(): void { }
    onDelete(){
        if (this.codeVerif===this.password){
            // // let q =0
            // // var article : any
            // // this.shareService.getArticle(this.vente.article).subscribe((a :any) => {
            // //     console.log(a)
            // //     article= a.payload.val()
            // //     console.log(article)

            // // }).unsubscribe()
            // //     console.log(article)
            // //    q= article.quantite;
            // //    console.log(q)
            // //     console.log(this.mouvement.quantite)
            // //    q-=this.mouvement.quantite
            // //    console.log(q)
            this.shareService.deleteVente(this.key).then(()=>{
                // this.shareService.updateArticleQte(this.mouvement.article,q)
                this.shareService.showMsg("Vente supprimée avec succès");
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
