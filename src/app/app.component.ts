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
import { DMouvementComponent } from './Modal/DMouvement.component';


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
  stockInit: number;
  prixAchat: number;
  prixVente: number;
  dateAjout: Date;
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
  Vente: string[] = ['Qte', 'Article', 'PU', 'Total'];

  Article_Caisse: string[] = ['action', 'Qte', 'Article', 'PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'stockInit', 'Palette','prixAchat', 'prixVente', 'dateAjout', 'actions'];
  Stock_columns: string[] = ['reference', 'designation', 'date', 'operation', 'acteur', 'quantité', 'prix', 'valeur', 'actions']
  stock: any;
  dataSource = [];
  dateTime = new Date()
  Articles: any[];
  Mouvements: any[];
  active_articles: any[];
  vente_caisse: any[];
  ventes : any[];

  articles: MatTableDataSource<any>;
  mouvements: MatTableDataSource<any>;

  mouvement : any  = {};

  operation = new FormControl('Entrée', Validators.required);
  acteur = new FormControl('', Validators.required);
  article = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);
  quantite = new FormControl('', Validators.required);


  constructor(public dialog: MatDialog,
    db: AngularFireDatabase,
    private route: ActivatedRoute,
    private shareservice: ShareService) {

      this.mouvement.operation = 'Entrée'
      this.mouvement.acteur = ''
      this.mouvement.article = ''
      this.mouvement.date = ''
      this.mouvement.quantite= 0

  }


  ngOnInit() {
    this.shareservice.getArticles().subscribe(data => {
      this.Articles = [];
      data.forEach(element => {
        this.Articles.push({ key: element.key, ...element.payload.val() as {} })
      })

      this.l = this.Articles.length + 1

    })
    this.shareservice.getMouvements().subscribe(data => {
      this.Mouvements = [];
      data.forEach(element => {
        this.Mouvements.push({ key: element.key, ...element.payload.val() as {} })
        const a = this.shareservice.getArticle(this.Mouvements[this.Mouvements.length - 1].article)
      })
      this.mouvements = new MatTableDataSource<any>(this.Mouvements);
    })
    this.shareservice.getActiveArticles().subscribe(data => {
      this.active_articles = [];
      data.forEach(element => {
        this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
      })
      this.articles = new MatTableDataSource<any>(this.active_articles);
    })
    let i = 0
    this.shareservice.getVentes().subscribe(data => {
      this.ventes = [];
      data.forEach(element => {
        i+=1
        this.ventes.push({...element.payload.val() as {} })
      })
      this.ventes.sort((a, b) => a < b? 1 : 0);
      console.log(this.ventes)
      // this.articles = new MatTableDataSource<any>(this.active_articles);
    })
    this.vente_caisse = [];
  }
  Nombre(total): any {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  //Calculatrice
  openCalculatrice(article: Article): void {
    const dialogRef = this.dialog.open(CalculeComponent, {
      width: '600px',
      data: { article: article }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result.data);
      if(result.data){
      const index = this.dataSource.findIndex((item: any) => {
        return item.article == result.data.article;
      })
      if (index == -1) {
        this.dataSource.push(result.data)
        this.dataSource = [...this.dataSource]
      } else {
        this.dataSource[index].quantite += result.data.quantite;
      }}
      // this.dataSource = [...this.dataSource]

    });
  }
  // Ajouter Article
  openAjoutArticle(): void {
    const dialogRef = this.dialog.open(CArticleComponent, {
      maxWidth: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: this.l

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Etidter Article
  openEditArticle(element: any): void {
    const dialogRef = this.dialog.open(UArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: element

    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  // Supprimer Article
  openSupprimeArticle(element: any): void {
    const dialogRef = this.dialog.open(DArticleComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  //Supprimer Mouvement
  openSupprimeMouvement(element: any): void {
    const dialogRef = this.dialog.open(DMouvementComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  //Verificcation Stock
  get isValidInventaire(): boolean {
    return this.mouvement.operation==='' || this.mouvement.acteur==='' || this.mouvement.article==='' || this.mouvement.date==='' || this.mouvement.quantite===0
  }
  table (j) {
    let v : any[]
    let i = 0
    v = this.ventes[j]
    const V = Object.values(v)
    return V
  }
  AjoutMouvement() {
    let qte = this.mouvement.quantite;
    if (this.isValidInventaire === false) {
      let item = this.getArticle(this.mouvement.article).quantite;
      if (this.mouvement.operation === "Entrée") { qte += item
      console.log("entree",qte) }
      else { qte = item-qte
        console.log("sortie",qte)  }
      if (qte >= 0) {
        const obj = {
          operation: this.mouvement.operation,
          acteur: this.mouvement.acteur,
          article: this.mouvement.article,
          date: this.mouvement.date,
          quantite: this.mouvement.quantite,
          prix: this.getArticle(this.mouvement.article).prixAchat
        }
        this.shareservice.addMouvement(obj).then(() => {
          this.shareservice.updateArticleQte(obj.article, qte)
          this.shareservice.showMsg("Mouvement ajouté avec succès");
        })
          .catch(error => {
            this.shareservice.showMsg(error.message);
          });
      }
      else {
        this.shareservice.showMsg("La Quantité en stock est insuffisante")
      }
    }
  }
  // Annuler Operation de vente
  annuler() {
    this.dataSource = [];
  }
  // Passer Operation de Vente
  passer() {
    let ok =true
    let i
      this.dataSource.forEach((element) => {
        let qte = element.quantite
        let item = this.getArticle(element.article);
        qte = item.quantite-qte
       if( qte<0 ) {
         ok =false
         i = item
       }
        console.log(ok)
      });
    if(ok ==true){
    this.shareservice.addVente(this.dataSource).then(()=>{
  
    if(this.dataSource.length>0){
      this.dataSource.forEach((element) => {
        let qte = element.quantite
        console.log(element)
        let item = this.getArticle(element.article).quantite;
        qte = item-qte
       console.log(item)
       if (qte >= 0) {
        this.shareservice.updateArticleQte(element.article, qte)
       }
       else {

       }
      });
    }
    this.dataSource=[]
  })
}
else{
  this.shareservice.showMsg("La Quantite en stock de : "+ i.designation + " est Insuffisante")
}
    // window.print();
  }
  supprimer(i) {

    this.dataSource.splice(i, 1);
    this.dataSource = [...this.dataSource]
  }
  setColor(item){
    if (item.quantite<=item.stockMin)
    return{"background-color" : 'gainsboro'};
     
    
  }
  getTotalprix() {
    return this.dataSource.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0);
  }
  getTotal(j){
    let v : any[]
    let i = 0
    v = this.ventes[j]
    const V = Object.values(v)
    return(V.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0))
  }
  //Chercher un Article par sa clé
  getArticle(key: string): any {
    const index = this.Articles.map(e => e.key).indexOf(key);
    return this.Articles[index];
  }
  // Filtrer Articles
  FiltrerArticles(filterValue: string) {
    this.articles.filter = filterValue.trim().toLowerCase();
  }
  FiltrerMouvement(filterValue: string) {
    this.mouvements.filter = filterValue.trim().toLowerCase();
  }
}
