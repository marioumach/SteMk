import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ShareService } from 'src/services/share.service';
import { DVenteComponent } from '../Modal/DVente.component';
import { VenteJoursService } from './venteJours.service';

@Component({
    selector: 'app-venteJours',
    templateUrl: './venteJours.component.html',
    styleUrls: ['./venteJours.component.scss']
})
export class VenteJoursComponent implements OnInit {
    Vente: string[] = ['Qte', 'Article', 'PU', 'Total'];
    Articles: any[] = [];
    venteJours: any[] = [];
    active_articles: any[]=[];
    TVentes: any[] = [];
    dataSource = [];
    ventes: any[] = [];
    Ventes: any[] = [];
    Tventes: any[] = [];
    JVentes: any[] = [];
    VenteJours:any
    options = { month: '2-digit', day: '2-digit', year: 'numeric' };

    dateTime = new Date()
    d1 = this.dateTime.getDate()
    m1 = this.dateTime.getMonth() + 1
    y1 = this.dateTime.getFullYear()
    Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
    DateTime = this.Y.toLocaleDateString("en-US", this.options)
    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private shareService : ShareService,
        private venteJoursService: VenteJoursService) {
        this.route.data.subscribe((data) => { this.VenteJours = data.venteJours })
        this.VenteJours.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.GetVentesJ()

    }
    getTodayTotal(j) {
        let v: any[]
        let i = 0
    
        v = this.Tventes[j]
        const V = Object.values(v)
        return (V.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0))
      }
      getTodayTotalCA() {
        let CA = 0
        for (let i = 0; i < this.Tventes.length; i++) {
          CA += this.getTodayTotal(i)
        }
        return this.Nombre(CA)
      }
      todayVente(j) {
        let v: any[]
        let i = 0
        v = this.Tventes[j]
        const V = Object.values(v)
        return V
      }
      Nombre(total): any {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      };
      getArticle(key: string): any {
        const index = this.Articles.map(e => e.key).indexOf(key);
        return this.Articles[index];
      }

    GetVentesJ() {
        let i = 0
        this.VenteJours.ventes.forEach(element => {
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
  }
}
GetVentes() {
  let i = 0
  this.shareService.getVentes().subscribe(data => {
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
}})

}
    openSupprimeTodayVente(i, v): void {

        const dialogRef = this.dialog.open(DVenteComponent, {
          width: '600px',
          panelClass: 'app-full-bleed-dialog',
          data: { key: this.TVentes[i], articles: v }
        });
    
        dialogRef.afterClosed().subscribe(result => {
this.GetVentes()        });}
    ngOnInit(): void { }
}
