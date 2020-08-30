import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from 'src/services/share.service';
@Component({
    selector: 'app-UArticle',
    templateUrl: './UArticle.component.html'
})
export class UArticleComponent implements OnInit {
    valider = false;
    article : any ;
    key : any ;
    codeVerif ="";
    password = "55413494"
    constructor(
        public dialogRef: MatDialogRef<UArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService: ShareService) { 
            this.article=data;
            this.article.reference = data.reference ;
            this.article.designation = data.designation ;
            this.article.stockMin=data.stockMin;
            this.article.stockInit=data.quantite;
            this.article.prixAchat=data.prixAchat;
            this.article.prixVente=data.prixVente;
            this.article.dateAjout=data.dateAjout;
            this.article.image = data.image
           this.key = data.key



        }
        articleImage: any ;

        onChange(evt) {
            this.articleImage = evt.target.files[0];
        }
    ngOnInit(): void { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    editArticle():void{
        if (this.codeVerif === this.password) {
            if(this.article.prixVente<=this.article.prixAchat){
                this.shareService.showMsg("Le prix de vente doit être supérieur au prix d'achat");
            }else{
            this.valider = true;
            this
            
            const obj = {
                // reference: this.reference.value,
                reference :this.article.reference,
                designation: this.article.designation,
                quantite: Number(this.article.stockInit),
                stockMin: Number(this.article.stockMin),
                prixAchat: Number(this.article.prixAchat),
                prixVente: Number(this.article.prixVente),
                dateAjout: this.article.dateAjout,
                image : this.article.image
            }
            this.shareService.UpdateArticle(obj,this.key).then(() => {
                this.updateArticleImage(this.article.key)

                this.shareService.showMsg("Article modifié avec succès");
            })
                .catch(error => {
                    this.shareService.showMsg(error.message);
                });
            this.dialogRef.close();
        }}
        else {
            this.shareService.showMsg('Code de confirmation Incorrecte')
        }


    }
    updateArticleImage(key : any){
        if (this.articleImage){
       this.shareService.uploadArticleImage(this.articleImage ,key); } 
     }
}
