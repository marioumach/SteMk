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
import { MatSort } from '@angular/material/sort';
import { DVenteComponent } from './Modal/DVente.component';
import { EchangeComponent } from './Modal/echange.component';

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
  @ViewChild('sortM') sortM: MatSort;
  @ViewChild('sortA') sortA: MatSort;

  items: Observable<any[]>;
  title = 'SteMk';
  prix: 3300;
  l: Number;
  Vente: string[] = ['Qte', 'Article', 'PU', 'Total'];
  CA: any
  Article_Caisse: string[] = ['action', 'Article', 'Qte', 'PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'quantite', 'Palette', 'prixAchat', 'prixVente', 'dateAjout', 'actions'];
  Stock_columns: string[] = ['reference', 'designation', 'date', 'operation', 'acteur', 'quantité', 'prix', 'valeur', 'actions']
  stock: any;
  Historique:any
  dataSource = [];
  options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  dateTime = new Date()
  d1 = this.dateTime.getDate()
  m1 = this.dateTime.getMonth() + 1
  y1 = this.dateTime.getFullYear()
  Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
  DateTime = this.Y.toLocaleDateString("en-US", this.options)
  Articles: any[];
  Mouvements: any[] = [];
  active_articles: any[];
  articles_vente: any[];
  vente_caisse: any[];
  ventes: any[] = [];
  filtered_V: any[];
  Tventes: any[] = [];
  JVentes: any[][] = []
  TV: any[] = []
  TVentes: any[] = [];
  Ventes: any[] = [];
  loading = false;

  articles: MatTableDataSource<any>;
  mouvements: MatTableDataSource<any>;

  mouvement: any = {};

  operation = new FormControl('Entrée', Validators.required);
  acteur = new FormControl('', Validators.required);
  article = new FormControl('', Validators.required);
  date = new FormControl('', Validators.required);
  quantite = new FormControl('', Validators.required);

  startDate = new Date().toString();
  endDate = new Date().toString();
  disabled = false;
  MDP: string
  constructor(public dialog: MatDialog,
    db: AngularFireDatabase,
    private route: ActivatedRoute,
    private shareservice: ShareService) {
    this.mouvement.operation = 'Entrée'
    this.mouvement.acteur = ''
    this.mouvement.article = ''
    this.mouvement.date = ''
    this.mouvement.quantite = 0
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
        let m: any
        m = element.payload.val()
        this.Mouvements.push({ key: element.key, ...element.payload.val() as {}, reference: this.getArticle(m.article).reference, designation: this.getArticle(m.article).designation })
        const a = this.shareservice.getArticle(this.Mouvements[this.Mouvements.length - 1].article)
      })
      this.mouvements = new MatTableDataSource<any>(this.Mouvements);
      this.mouvements.sort = this.sortM;
    })
    this.shareservice.getActiveArticles().subscribe(data => {
      this.active_articles = [];
      data.forEach(element => {
        this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
      })
      this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));

      this.articles = new MatTableDataSource<any>(this.active_articles);
      this.articles.sort = this.sortA;

    })
    this.GetVentes()
    this.vente_caisse = [];
  }


  ngOnInit() {

  }
  SupprimerVente(v) {
    this.shareservice.deleteVente(this.Ventes[v])
  }
  Nombre(total): any {
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  openCalculatrice(article: Article): void {
    const dialogRef = this.dialog.open(CalculeComponent, {
      width: '800px',
      height: '600px',
      data: { article: article }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        if (result.data) {
          const index = this.dataSource.findIndex((item: any) => {
            return item.article == result.data.article;
          })
          if (index == -1) {
            this.dataSource.push(result.data)
            this.dataSource = [...this.dataSource]
          } else {
            this.dataSource[index].quantite += result.data.quantite;
          }
        }
      }
      // this.dataSource = [...this.dataSource]

    });
  }
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
  openEchange(element: any): void {
    const dialogRef = this.dialog.open(EchangeComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  get isValidInventaire(): boolean {
    return this.mouvement.operation === '' || this.mouvement.acteur === '' || this.mouvement.article === '' || this.mouvement.date === '' || this.mouvement.quantite === 0
  }
  get isValidVente(): boolean {
    return this.dataSource.length == 0
  }
  table(j) {
    let v: any[]
    let i = 0
    v = this.ventes[j]
    const V = Object.values(v)
    return V
  }
  Table(jvente) {
    let v: any[]
    let i = 0
    v = jvente
    const V = Object.values(v)
    return V
  }
  todayVente(j) {
    let v: any[]
    let i = 0
    v = this.Tventes[j]
    const V = Object.values(v)
    return V
  }
  AjoutMouvement() {
    let i =this.active_articles.findIndex(i => i.key ===this.mouvement.article );
    let qte = this.getReste(this.getArticle(this.mouvement.article),i)
    if (this.isValidInventaire === false) {
      let item = this.getArticle(this.mouvement.article).quantite;
      if (this.mouvement.operation === "Entrée") {
        qte = qte + this.mouvement.quantite
      }
      else {
        qte = qte - this.mouvement.quantite
       }
  
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
          this.shareservice.updateArticleQte(obj.article, qte).then(()=>{
            this.shareservice.showMsg("Mouvement ajouté avec succès");
          }).catch(error=>{
            this.shareservice.showMsg("Erreur Modifier quantite article");

          })
        }) .catch(error => {
          this.shareservice.showMsg("Erreur Ajouter Mouvement");
          this.shareservice.showMsg(error.message);
          });
      }
      else {
        this.shareservice.showMsg("La Quantité en stock est insuffisante")
      }
    }
  }
  annuler() {
    this.dataSource = [];
  }
  passer() {
    this.loading = true;
    let i
    this.dataSource.forEach((element) => {
      let qte = element.quantite
      let item = this.getArticle(element.article);
      qte = item.quantite - qte
      if (qte < 0) {
        this.shareservice.showMsg("La Quantite en stock de : " + item.designation + " est Insuffisante")
      }
    });

    this.shareservice.addVente(this.dataSource).then(() => {
      this.dataSource.forEach((element) => {
        let i =this.active_articles.findIndex(i => i.key === element.article );
        let qte = this.getReste(this.getArticle(element.article),i)
        this.shareservice.updateArticleQte(element.article, qte).catch(erreur=>{
          this.shareservice.showMsg("erreur Modififer quantite article")
        })
      });
      this.dataSource = []
      this.loading = false;
    })
      .catch(error => {
        console.error(error.message);
        this.shareservice.showMsg("Erreur Passer vente");
        this.loading = false;

      });
  }
  openSupprimeTodayVente(i, v): void {

    const dialogRef = this.dialog.open(DVenteComponent, {
      width: '600px',
      panelClass: 'app-full-bleed-dialog',
      data: { key: this.TVentes[i], articles: v }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  supprimer(i) {

    this.dataSource.splice(i, 1);
    this.dataSource = [...this.dataSource]
  }
  setColor(item) {
    if (item.quantite <= item.stockMin) {
      if (item.quantite >= 0) {
        return { "background-color": 'gainsboro' };
      }
      else {
        return { "background-color": '#EABDA8' }
      }
    }
  }
  getTotalprix() {
    return this.dataSource.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0);
  }
  getTotal(j) {
    let v: any[]
    let i = 0
    v = this.ventes[j]
    const V = Object.values(v)
    return (V.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0))
  }
  getTodayTotal(j) {
    let v: any[]
    let i = 0

    v = this.Tventes[j]
    const V = Object.values(v)
    return (V.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0))
  }
  getJourTotal(j) {
    let v: any[]
    let s = 0
    this.JVentes[j].forEach((v: any) => {
      const V = Object.values(v)
      s += V.map((t: any) => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0)
    });
    return s
  }
  getJourMarge(j) {
    let v: any[]
    let s = 0
    let a: any
    this.JVentes[j].forEach((v: any) => {
      const V = Object.values(v)

      s += V.map((t: any) => {
        a = this.getArticle(t.article).prixAchat
        return ((t.prixUnit - a) * t.quantite)
      }).reduce((acc, value) => acc + value, 0)
    });
    return s
  }
  getTotalCA() {
    let CA = 0
    for (let i = 0; i < this.JVentes.length; i++) {
      CA += this.getJourTotal(i)
    }
    return this.Nombre(CA)
  }
  getTotalMarge() {
    let M = 0
    for (let i = 0; i < this.JVentes.length; i++) {
      M += this.getJourMarge(i)
    }
    return this.Nombre(M)
  }
  getTodayTotalCA() {
    let CA = 0
    for (let i = 0; i < this.Tventes.length; i++) {
      CA += this.getTodayTotal(i)
    }
    return this.Nombre(CA)
  }
  getArticle(key: string): any {
    const index = this.Articles.map(e => e.key).indexOf(key);
    return this.Articles[index];
  }
  FiltrerArticles(filterValue: string) {
    this.articles.filter = filterValue.trim().toLowerCase();
  }
  FiltrerMouvement(filterValue: string) {
    this.mouvements.filter = filterValue.trim().toLowerCase();
  }
  Reset() {
    this.disabled = false
    this.MDP = ''
    this.GetVentes()
  }

  FilterVentes() {
    this.disabled = true
    this.filtered_V = []
    let i = 0
    this.JVentes.forEach((m: any) => {
      i += 1
      let day = m[0][0].date.substr(0, 2)
      let month = m[0][0].date.substr(3, 2)
      let year = m[0][0].date.substr(6, 4)
      let date = new Date(month + '-' + day + '-' + year)
      let debut = new Date(this.startDate)
      let fin = new Date(this.endDate)
      let D1 = debut.getDate()
      let M1 = debut.getMonth() + 1
      let Y1 = debut.getFullYear()
      let Debutdate = new Date(M1 + '-' + D1 + '-' + Y1)
      let D2 = fin.getDate()
      let M2 = fin.getMonth() + 1
      let Y2 = fin.getFullYear()
      let Findate = new Date(M2 + '-' + D2 + '-' + Y2)

      if ((Debutdate <= date) && (date <= Findate))
        this.filtered_V.push(m)
    });
    this.JVentes = this.filtered_V

  }
  GetVentes() {
    let i = 0
    this.shareservice.getVentes().subscribe(data => {
      this.ventes = [];
      this.Ventes = [];
      this.Tventes = [];
      this.TVentes = [];
      this.JVentes = [];
      data.forEach(element => {
        i += 1
        this.ventes.push({ ...element.payload.val() as {} })
        this.Ventes.push(element.key)
        let d = element.payload.val()[0].date
        let day = d.substr(0, 2)
        let month = d.substr(3, 2)
        let year = d.substr(6, 4)
        let date = new Date(month + '-' + day + '-' + year).toLocaleDateString("en-US", this.options)
        if (date == this.DateTime) {
          this.Tventes.push({ ...element.payload.val() as {} })
          this.TVentes.push(element.key)
        }
      })
      this.ventes.sort((a, b) => a < b ? 1 : 0);
      let jour = this.ventes[0][0].date[0] + this.ventes[0][0].date[1]
      let jVente = []
      this.ventes.forEach(element => {
        let date = element[0].date[0] + element[0].date[1]
        if (date == jour) {
          jVente.push(element)
        }
        else {
          this.JVentes.push(jVente)
          jour = date
          jVente = []
          jVente.push(element)
        }
      });
      this.JVentes.push(jVente)
    })
  }
  getDate(ch: string) {
    return (ch.slice(0, 10))
  }
  getArticleVendu(j, k: any) {
    let qte = 0
    this.JVentes[k].forEach((jvente: any[]) => {
      this.Table(jvente).forEach(vente => {
        if (vente.article == this.active_articles[j].key)
          qte += vente.quantite
      });
    });
    return qte
  }
  getArticleSorti(j, k: any) {
    let qte = 0
    this.Mouvements.forEach(mouvement => {
      let year = mouvement.date.substr(0, 4)
      let day
      let month
      day = mouvement.date.substr(8, 2)
      month = mouvement.date.substr(5, 2)
      let date = day + '/' + month + '/' + year
      if (this.getDate(this.JVentes[k][0][0].date) === date) {
        if (j == mouvement.article && mouvement.operation == 'Sortie') {
          qte += mouvement.quantite
        }
      }
    });
    return qte
  }

  getTotalArticleSorti(j: any) {
    let qte = 0
    this.Mouvements.forEach(mouvement => {
      if (j == mouvement.article && mouvement.operation == 'Sortie')
        qte += mouvement.quantite

    });
    return qte
  }
  getTotalArticleVendu(j: any) {
    let qte = 0
    let k = -1
    this.JVentes.forEach(J => {
      k++
      qte += this.getArticleVendu(j, k)
    });
    return qte
  }
  getArticleEntree(j, k: any) {
    let qte = 0
    this.Mouvements.forEach(mouvement => {
      let year = mouvement.date.substr(0, 4)
      let day
      let month
      day = mouvement.date.substr(8, 2)
      month = mouvement.date.substr(5, 2)
      let date = day + '/' + month + '/' + year
      if (this.getDate(this.JVentes[k][0][0].date) === date) {
        if (j == mouvement.article && mouvement.operation == 'Entrée') {
          qte += mouvement.quantite
        }
      }
    });
    return qte
  }

  getTotalArticleEntree(j: any) {
    let qte = 0
    this.Mouvements.forEach(mouvement => {
      if (j == mouvement.article && mouvement.operation == 'Entrée')
        qte += mouvement.quantite

    });
    return qte
  }
  SetColorHistorique(item,j) {
    if (this.getReste(item,j) != item.quantite) {
        return { "background-color": '#EABDA8' }
    }
  }
  getReste(item,j){
    return  this.getTotalArticleEntree(item.key)-this.getTotalArticleVendu(j)-this.getTotalArticleSorti(item.key)

  }
  
}
