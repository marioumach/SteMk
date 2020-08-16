import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../app.component';

@Component({
    selector: 'app-DArticle',
    templateUrl: './DArticle.component.html'
})
export class DArticleComponent implements OnInit {
    hide = true;
    constructor( dialogRef: MatDialogRef <DArticleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    ngOnInit(): void { }
}
