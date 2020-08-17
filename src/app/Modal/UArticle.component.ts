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
            console.log(data)
            this.article=data;
            this.article.reference = data.reference ;
            this.article.designation = data.designation ;
            this.article.stockMin=data.stockMin;
            this.article.stockInit=data.quantite;
            this.article.prixAchat=data.prixAchat;
            this.article.prixVente=data.prixVente;
            this.article.dateAjout=data.dateAjout;
           this.key = data.key



        }

    ngOnInit(): void { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    editArticle():void{
        if (this.codeVerif === this.password) {
            this.valider = true;
            
            const obj = {
                // reference: this.reference.value,
                reference :this.article.reference,
                designation: this.article.designation,
                quantite: Number(this.article.stockInit),
                stockMin: Number(this.article.stockMin),
                prixAchat: Number(this.article.prixAchat),
                prixVente: Number(this.article.prixVente),
                dateAjout: this.article.dateAjout
            }
            this.shareService.UpdateArticle(obj,this.key).then(() => {
                this.shareService.showMsg("Article modifié avec succès");
            })
                .catch(error => {
                    this.shareService.showMsg(error.message);
                });
            this.dialogRef.close();
        }
        else {
            this.shareService.showMsg('Code de confirmation Incorrecte')
        }


    }
}
