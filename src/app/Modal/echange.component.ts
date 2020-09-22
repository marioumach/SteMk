import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UArticleComponent } from './UArticle.component';
import { ShareService } from 'src/services/share.service';

@Component({
    selector: 'app-echange',
    templateUrl: './echange.component.html'
})
export class EchangeComponent implements OnInit {
    type :string
    Ancien : number = 0
    Nouveau : number = 0
    constructor(
        public dialogRef: MatDialogRef<UArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private shareService: ShareService
    ) { 
        this.type=data
this.plus()
    }
    plus(){
        if (this.type == '3 en 1') {
        this.Ancien+=3
        this.Nouveau+=1}
        else{
            this.Ancien+=1
            this.Nouveau+=3
        }
    }
    minus(){
        if (this.type == '3 en 1') {

        this.Ancien-=3
        this.Nouveau-=1 }
        else{
            this.Ancien-=1
            this.Nouveau-=3
        }
    }
echanger(){}
    ngOnInit(): void { }
}
