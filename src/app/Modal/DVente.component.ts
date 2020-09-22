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
    Articles : any[] = []
    key : any ;
    hide = true;
    constructor(public dialogRef: MatDialogRef <DVenteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService : ShareService) { 
            this.key = data.key;
            this.articles = data.articles;
            this.table().forEach(element => {
                this.shareService.getArticle(element.article).subscribe((a :any) => {
                    this.Articles.push({key : a.key , qteA : a.payload.val().quantite , qteV:element.quantite})
                 })
            }); 
            console.log(this.Articles)
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

            this.shareService.deleteVente(this.key).then(()=>{
                this.Articles.forEach(article => {
                    this.shareService.updateArticleQte(article.key,article.qteA+article.qteV)
                });
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
