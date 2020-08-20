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
import { FormControl, Validators } from '@angular/forms';


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
  prix: 3300;
  l: Number;
  Article_Caisse: string[] = ['N', 'Article', 'PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'stockInit','prixAchat','prixVente','dateAjout','actions'];
  Stock_columns:string[] = ['reference' , 'designation' , 'date' , 'operation' , 'acteur' , 'quantité' , 'prix' ,'valeur', 'actions']
  stock:any;
  dataSource = ELEMENT_DATA;

  Articles : any[];
  Mouvements : any[];

  articles: MatTableDataSource<any>;
  mouvements: MatTableDataSource<any>;

  operation= new FormControl('Entrée',Validators.required);
  acteur = new FormControl('', Validators.required);
  article = new FormControl('', Validators.required);
  date= new FormControl('', Validators.required);
  quantite = new FormControl('', Validators.required);


  constructor(public dialog: MatDialog,
              db: AngularFireDatabase,
              private route: ActivatedRoute,
              private shareservice: ShareService) {
           


               }
               
                Nombre(total)  : any{
                  return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                };
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
    })
    this.shareservice.getMouvements().subscribe(data => {
      console.log(data)
      this.Mouvements = [];
      data.forEach(element => {
        console.log(element.key)
        this.Mouvements.push({ key :element.key ,...element.payload.val() as {}})
        const a =this.shareservice.getArticle(this.Mouvements[this.Mouvements.length-1].article)
        console.log(a)
      })
      console.log(this.Mouvements)
      this.mouvements = new MatTableDataSource<any>(this.Mouvements);
    })
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
  //Verificcation Stock
  get isValidInventaire () : boolean{
    return this.operation.invalid || this.acteur.invalid || this.article.invalid || this.date.invalid || this.quantite.invalid
  }
  AjoutMouvement(){
    if (this.isValidInventaire === false){
            const obj = {
                operation :this.operation.value,
                acteur: this.acteur.value,
                article: this.article.value,
                date: this.date.value,
                quantite: this.quantite.value,
                prix : this.getArticle(this.article.value).prixAchat
            }
            
            this.shareservice.addMouvement(obj).then(() => {
                this.shareservice.showMsg("Mouvement ajouté avec succès");
            })
                .catch(error => {
                    this.shareservice.showMsg(error.message);
                });
    }}
  // Annuler Operation de vente
  annuler() {
    this.dataSource = [];
  }
  // Passer Operation de Vente
  passer() {
    window.print();
  }
  //Chercher un Article par sa clé
  getArticle (key: string) : any{
    const index = this.Articles.map(e => e.key).indexOf(key);   
     return this.Articles[index];
  }
  // Filtrer Articles
  FiltrerArticles(filterValue: string) {
    this.articles.filter = filterValue.trim().toLowerCase();
  }
}
