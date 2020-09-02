import { Component, Inject, ViewChild } from '@angular/core';
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
import {MatSort} from '@angular/material/sort';
import { DVenteComponent } from './Modal/DVente.component';


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
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  items: Observable<any[]>;
  title = 'SteMk';
  prix: 3300;
  l: Number;
  Vente: string[] = ['Qte', 'Article', 'PU', 'Total'];
CA : any
  Article_Caisse: string[] = ['action',  'Article', 'Qte','PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'stockInit', 'Palette','prixAchat', 'prixVente', 'dateAjout', 'actions'];
  Stock_columns: string[] = ['reference', 'designation', 'date', 'operation', 'acteur', 'quantité', 'prix', 'valeur', 'actions']
  stock: any;
  dataSource = [];
  dateTime = new Date()
  DateTime = this.dateTime.toLocaleString().substr(0,10)
  day = this.dateTime.getDate()
  month = this.dateTime.getMonth()
  year = this.dateTime.getFullYear()
  Articles: any[];
  Mouvements: any[];
  active_articles: any[];
  vente_caisse: any[];
  ventes : any[] = [];
  Tventes : any[] = [];
  TVentes : any[]=[];
  Ventes : any[] = [];
  loading = false;

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
        let m : any 
        m = element.payload.val()
        this.Mouvements.push({ key: element.key, ...element.payload.val() as {} , designation : this.getArticle(m.article).designation})
        const a = this.shareservice.getArticle(this.Mouvements[this.Mouvements.length - 1].article)
      })
      this.mouvements = new MatTableDataSource<any>(this.Mouvements);
      console.log(this.mouvements)
      this.mouvements.sort = this.sort;
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
      this.Ventes = []
      data.forEach(element => {
        i+=1
        this.ventes.push({...element.payload.val() as {} })
        this.Ventes.push(element.key)
        
        let d = new Date((element.payload.val()[0].date).substr(0,10));
        let D = d.toLocaleString().substr(0,10)
        console.log(D)
        console.log(this.DateTime)
        if(D==this.DateTime){
          console.log(true)
        }
      })
      this.ventes.sort((a, b) => a < b? 1 : 0);
      this.CA=this.getTotalCA();
      // this.articles = new MatTableDataSource<any>(this.active_articles);
    })
    this.vente_caisse = [];
  }
  SupprimerVente(v){
    console.log(this.Ventes[v])
    this.shareservice.deleteVente(this.Ventes[v])
  }
  Nombre(total): any {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  //Calculatrice
  openCalculatrice(article: Article): void {
    const dialogRef = this.dialog.open(CalculeComponent, {
      width: '800px',
      height:'600px',
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
    this.loading=true;
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
    this.loading= false;
  })      .catch(error => {
    console.error(error.message);
    this.shareservice.showMsg("Une erreur s'est produite" );
    this.loading= false;

  });

}
else{
  this.shareservice.showMsg("La Quantite en stock de : "+ i.designation + " est Insuffisante")
}
    // window.print();
  }
    //Supprimer Mouvement
    openSupprimeVente(i , v): void {
      console.log(i)
      console.log(v)
      const dialogRef = this.dialog.open(DVenteComponent, {
        width: '600px',
        panelClass: 'app-full-bleed-dialog',
        data: {key : this.Ventes[i] , articles : v}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
      });
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
  getTotalCA(){
    let CA = 0
    for (let i = 0; i < this.Ventes.length; i++) {
      CA+=this.getTotal(i)
    }
return this.Nombre(CA)
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
    console.log(this.mouvements)
    this.mouvements.filter = filterValue.trim().toLowerCase();
  }
}
