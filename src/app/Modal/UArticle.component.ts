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
    password ="";
    constructor(
        public dialogRef: MatDialogRef<UArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService: ShareService) { 
            console.log(data)
            this.article=data;
            this.article.reference = data.reference ;
            this.article.designation = data.designation ;
            this.article.stockMin=data.stock;
            this.article.stockInit=data.quantite;
            this.article.prixAchat=data.prixAchat;
            this.article.prixVente=data.prixVente;
            this.article.dateAjout=data.dateAjout;
           



        }

    ngOnInit(): void { }
    onNoClick(): void {
        this.dialogRef.close();
    }
    editArticle():void{

    }
}
