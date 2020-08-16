import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculeComponent } from './Modal/calcule.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { ShareService } from 'src/services/share.service';
import { ActivatedRoute } from '@angular/router';
import { DArticleComponent } from './Modal/DArticle.component';
import { CArticleComponent } from './Modal/CArticle.component';


export interface DialogData {
  article: 'Safia';
  prix: 3300;
}
export interface PeriodicElement {
  Article: string;
  N: number;
  PU: number;
  Total: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { N: 1, Article: 'Safia', PU: 3300, Total: 'H' },
  { N: 2, Article: 'Melliti', PU: 2600, Total: 'He' },
  { N: 3, Article: 'Marwa', PU: 2900, Total: 'Li' }

];
export interface Article {
  N: number;
  Libelle: string;
  Path: string;
  Prix: number;
}
const Articles: Article[] = [
  { N: 1, Libelle: 'Safia', Path: '', Prix: 3300 },
  { N: 2, Libelle: 'Sabrine', Path: '', Prix: 3300 },
  { N: 3, Libelle: 'Maroua', Path: '', Prix: 3000 },
  { N: 4, Libelle: 'Cristaline', Path: '', Prix: 2800 },
  { N: 5, Libelle: 'Jannet', Path: '', Prix: 3200 },
  { N: 6, Libelle: 'Fourat', Path: '', Prix: 3300 },
  { N: 7, Libelle: 'Melliti', Path: '', Prix: 2600 },
  { N: 8, Libelle: 'Pristine', Path: '', Prix: 3600 },
  { N: 9, Libelle: 'Denya', Path: '', Prix: 3700 },
  { N: 10, Libelle: 'Primaqua', Path: '', Prix: 6000 }

]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  items: Observable<any[]>;
  title = 'SteMk';
  article: 'Safia';
  prix: 3300;
  Qte: Number;
  displayedColumns: string[] = ['N', 'Article', 'PU', 'Total'];
  displayedColumns1: string[] = ['N', 'Article', 'PU', 'Total', 'actions'];

  dataSource = ELEMENT_DATA;
  articles = Articles;

  ingredients: any[] = [];


  constructor(public dialog: MatDialog, db: AngularFireDatabase, private route: ActivatedRoute,
    private shareservice: ShareService) {
    const a = db.list('Article').valueChanges()
    console.log(a)
    // this.shareservice.addArticle().then(() => {
    //   this.shareservice.showMsg('Article ajouté')
    // })



  }
  ngOnInit() {
    this.shareservice.getArticles().subscribe(data => {
      console.log(data)
      this.ingredients = [];
      data.forEach(element => {
        console.log(element.key)
        this.ingredients.push({ ...element.payload.val() as {} })
      })
      console.log(this.ingredients)
    }
    )
  }

//Calculatrice
  openCalculatrice(article: Article): void {
    console.log(article)
    const dialogRef = this.dialog.open(CalculeComponent, {
      width: '600px',
      data: { prix: '3300', article: 'Safia' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.Qte = Number(result);
      this.dataSource.push()
    });
  }
  // Ajouter Article
  openAjoutArticle() : void{
    const dialogRef = this.dialog.open(CArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog', 

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Supprimer Article
  openSupprimeArticle(): void {
    const dialogRef = this.dialog.open(DArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog', 

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Annuler Operation de vente
  annuler() {
    this.dataSource = [];
  }
  // Passer Operation de Vente
  passer() {
    window.print();
  }
}
