import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-ventes',
    templateUrl: './ventes.component.html',
    styleUrls: ['./ventes.component.scss']
})
export class VentesComponent implements OnInit {
    
  items: Observable<any[]>;
  title = 'SteMk';
  prix: 3300;
  l: Number;
  Vente: string[] = ['Qte', 'Article', 'PU', 'Total'];
  CA: any
  Article_Caisse: string[] = ['action', 'Article', 'Qte', 'PU', 'Total'];
  Article_columns: string[] = ['reference', 'designation', 'stockMin', 'quantite', 'Palette', 'prixAchat', 'prixVente', 'dateAjout', 'actions'];
  Stock_columns: string[] = ['reference' , 'designation', 'date', 'operation', 'acteur', 'quantité', 'prix', 'valeur', 'actions']
  stock: any;
  vente:any
  dataSource = [];
  options = { month: '2-digit', day: '2-digit', year: 'numeric' };
  dateTime = new Date()
  d1 = this.dateTime.getDate()
  m1 = this.dateTime.getMonth() + 1
  y1 = this.dateTime.getFullYear()
  Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
  DateTime = this.Y.toLocaleDateString("en-US", this.options)
  Articles: any[]=[];
  articles:any;
  Mouvements: any[] = [];
  active_articles: any[]=[];
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
    disabled = false;
    startDate = new Date().toString();
    endDate = new Date().toString();
    MDP: string
    GetVentes() {
        let i = 0
        this.route.data.subscribe((data) => { this.vente = data.ventes })  
        this.ventes = [];
          this.Ventes = [];
          this.Tventes = [];
          this.TVentes = [];
          this.JVentes = [];
        this.vente.ventes.forEach(element => {
            i += 1
            this.ventes.push({ ...element.payload.val() as {} })
            let d = element.payload.val()[0].date
            let day = d.substr(0, 2)
            let month = d.substr(3, 2)
            let year = d.substr(6, 4)
            let date = new Date(month + '-' + day + '-' + year).toLocaleDateString("en-US", this.options)
            if (date == this.DateTime) {
              this.Tventes.push({ ...element.payload.val() as {} })
            }
          })
          if (this.ventes.length>0){        this.ventes.sort((a, b) => a < b ? 1 : 0);
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
            this.l=this.TVentes.length  
    }
    else
    {this.l=0}
      
      }
      GetVentesMois() {
        let i = 0
        this.route.data.subscribe((data) => { this.vente = data.ventes })  
        this.ventes = [];
          this.Ventes = [];
          this.Tventes = [];
          this.TVentes = [];
          this.JVentes = [];
        this.vente.ventes.forEach(element => {
            i += 1
            let d = element.payload.val()[0].date
            let day = d.substr(0, 2)
            let month = d.substr(3, 2)
            let year = d.substr(6, 4)
            let date = new Date(month + '-' + day + '-' + year).toLocaleDateString("en-US", this.options)
            if (this.m1==month) {
             
              this.ventes.push({ ...element.payload.val() as {} })
            }
          })
          if (this.ventes.length>0){        this.ventes.sort((a, b) => a < b ? 1 : 0);
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
            this.l=this.TVentes.length  
    }
    else
    {this.l=0}
      
      }
    Reset() {
        this.disabled = false
        this.MDP = ''
        this.GetVentes()
      }
    
      FilterVentes() {
        this.GetVentes()
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
      getTotalCA() {
        let CA = 0
        for (let i = 0; i < this.JVentes.length; i++) {
          CA += this.getJourTotal(i)
        }
        return this.Nombre(CA)
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
      Nombre(total): any {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      };
      getTotalMarge() {
        let M = 0
        for (let i = 0; i < this.JVentes.length; i++) {
          M += this.getJourMarge(i)
        }
        return this.Nombre(M)
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
      getArticle(key: string): any {
        const index = this.Articles.map(e => e.key).indexOf(key);
        return this.Articles[index];
      }
      getDate(ch: string) {
        return (ch.slice(0, 10))
      }
      update(){
        this.route.data.subscribe((data) => { this.vente = data.ventes })
        this.vente.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.GetVentesMois()
    }
    constructor(  private route: ActivatedRoute,
      ) { 
        this.update()
      }

    ngOnInit(): void { }
}
