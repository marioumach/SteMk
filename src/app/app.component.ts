import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalculeComponent } from './Modal/calcule.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { ShareService } from 'src/services/share.service';
import { ActivatedRoute } from '@angular/router';
import { DArticleComponent } from './Modal/DArticle.component';
import { CArticleComponent } from './Modal/CArticle.component';
import { MatTableDataSource } from '@angular/material/table';
import { UArticleComponent } from './Modal/UArticle.component';


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
  reference: string;
  designation: string;
  stockMin: number;
  stockInit: number ;
  prixAchat: number;
  prixVente : number ;
  dateAjout : Date ;
}
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
  l: Number;
  Article_Caisse: string[] = ['N', 'Article', 'PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'stockInit','prixAchat','prixVente','dateAjout','actions'];
  
  dataSource = ELEMENT_DATA;

  Articles : any[];
  articles: MatTableDataSource<any>;;


  constructor(public dialog: MatDialog,
              db: AngularFireDatabase,
              private route: ActivatedRoute,
              private shareservice: ShareService) {
                  const a = db.list('Article').valueChanges()
                  console.log(a)
  }
  ngOnInit() {
    this.shareservice.getArticles().subscribe(data => {
      console.log(data)
      this.Articles = [];
      data.forEach(element => {
        console.log(element.key)
        this.Articles.push({ key :element.key ,...element.payload.val() as {}})
      })
      this.l = this.Articles.length+1
      console.log(this.Articles)
      this.articles = new MatTableDataSource<any>(this.Articles);
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
      this.dataSource.push()
    });
  }
  // Ajouter Article
  openAjoutArticle() : void{
    const dialogRef = this.dialog.open(CArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog', 
      data : this.l

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Etidter Article
  openEditArticle(element : any): void{
    const dialogRef = this.dialog.open(UArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog', 
      data:element

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Supprimer Article
  openSupprimeArticle(element : any): void {
    const dialogRef = this.dialog.open(DArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog', 
      data:element
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
  // Filtrer Articles
  FiltrerArticles(filterValue: string) {
    this.articles.filter = filterValue.trim().toLowerCase();
  }
}
