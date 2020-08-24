import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-CArticle',
    templateUrl: './CArticle.component.html',
    styleUrls:['./CArticle.component.scss']
})
export class CArticleComponent implements OnInit {
    valider = false;
    password = "55413494"
    reference = this.data
    designation = new FormControl('', Validators.required);
    stockMin = new FormControl('', Validators.required);
    stockInit = new FormControl('', Validators.required);
    prixAchat = new FormControl('', Validators.required);
    prixVente = new FormControl('', Validators.required);
    dateAjout = new FormControl('', Validators.required);
    codeVerif = new FormControl('', Validators.required);
    selectedItem: string = '';
    articleImage: any ;
 
    constructor(
        public dialogRef: MatDialogRef<CArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService: ShareService

    ) { }

    onChange(evt) {
        this.articleImage = evt.target.files[0];
        console.log(this.articleImage)
    }


    get isValid(): boolean {
        return this.designation.invalid || this.stockMin.invalid
            || this.stockInit.invalid || this.prixVente.invalid || this.prixVente.invalid
            || this.dateAjout.invalid || this.codeVerif.invalid
    }
    onNoClick(): void {
        this.dialogRef.close();
    }



    ajoutArticle() {
        if (this.codeVerif.value === this.password) {
            if(this.prixVente.value<=this.prixAchat.value){
                this.shareService.showMsg("Le prix de vente doit être supérieur au prix d'achat");
            }else{
            this.valider = true;
            const obj = {
                // reference: this.reference.value,
                reference :this.reference,
                designation: this.designation.value,
                quantite: Number(this.stockInit.value),
                stockMin: Number(this.stockMin.value),
                prixAchat: Number(this.prixAchat.value),
                prixVente: Number(this.prixVente.value),
                dateAjout: this.dateAjout.value,
                image :"",
                active : true
            }
            this.shareService.addArticle(obj).then((data) => {
                this.updateArticleImage(data.key)
                this.shareService.showMsg("Article ajouté avec succès");
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

    ngOnInit(): void {
        this.shareService.getArticleImage().subscribe((croppedImage) => {
            this.articleImage = croppedImage;
          })
     }
     
     updateArticleImage(key : any){
         if (this.articleImage){
        this.shareService.uploadArticleImage(this.articleImage ,key); } 
      }
    }
