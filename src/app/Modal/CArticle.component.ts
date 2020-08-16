import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-CArticle',
    templateUrl: './CArticle.component.html',
})
export class CArticleComponent implements OnInit {
    valider = false;
    reference = new FormControl('', Validators.required);
    designation = new FormControl('', Validators.required);
    stockMin = new FormControl('', Validators.required);
    stockInit = new FormControl('', Validators.required);
    prixAchat = new FormControl('', Validators.required);
    prixVente = new FormControl('', Validators.required);
    dateAjout = new FormControl('', Validators.required);
    password = new FormControl('', Validators.required);
    
    constructor(
        public dialogRef: MatDialogRef<CArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public payload: any,
        private shareService: ShareService

    ) { }

    get isValid(): boolean {
        return this.reference.invalid || this.designation.invalid || this.stockMin.invalid
            || this.stockInit.invalid || this.prixVente.invalid || this.prixVente.invalid
            || this.dateAjout.invalid || this.password.invalid
    }
    onNoClick(): void {
        this.dialogRef.close();
    }



    ajoutArticle() {
        if (this.password.value === "55413494") {
            this.valider = true;
            const obj = {
                // reference: this.reference.value,
                reference :1,
                designation: this.designation.value,
                quantite: Number(this.stockInit.value),
                stock: Number(this.stockMin.value),
                prixAchat: Number(this.prixAchat.value),
                prixVente: Number(this.prixVente.value),
                dateAjout: this.dateAjout.value,
            }
            this.shareService.addArticle(obj).then(() => {
                this.shareService.showMsg("Article ajouté avec succès");
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

    ngOnInit(): void { }
}
