import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-historique',
    templateUrl: './historique.component.html',
    styleUrls: ['./historique.component.scss']
})
export class HistoriqueComponent implements OnInit {
    historique: any
    Historique:any

    options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    dateTime = new Date()
    d1 = this.dateTime.getDate()
    m1 = this.dateTime.getMonth() + 1
    y1 = this.dateTime.getFullYear()
    Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
    DateTime = this.Y.toLocaleDateString("en-US", this.options)
    Article_historique: string[] = ['action', 'Article', 'Qte', 'PU', 'Total'];
    Articles: any[] = [];
    Mouvements: any[] = [];
    active_articles: any[]=[];
    TVentes: any[] = [];
    dataSource = [];
    ventes: any[] = [];
    Ventes: any[] = [];
    Tventes: any[] = [];
    JVentes: any[] = [];

    loading = false;
    articles: MatTableDataSource<any>;
    l: number

  
    constructor(        private route: ActivatedRoute,
        ) { 
            this.update()
        }
        SetColorHistorique(item,j) {
            if (this.getReste(item,j) != item.quantite) {
                return { "background-color": '#EABDA8' }
            }
          }
          getReste(item,j){
            return  this.getTotalArticleEntree(item.key)-this.getTotalArticleVendu(j)-this.getTotalArticleSorti(item.key)
        
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
          Table(jvente) {
            let v: any[]
            let i = 0
            v = jvente
            const V = Object.values(v)
            return V
          }
          getTotalArticleEntree(j: any) {
            let qte = 0
            this.Mouvements.forEach(mouvement => {
              if (j == mouvement.article && mouvement.operation == 'Entrée')
                qte += mouvement.quantite
        
            });
            return qte
          }
        GetVentes() {
            let i = 0
            this.historique.ventes.forEach(element => {
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
              this.l=this.TVentes.length  
      }
      else
      {this.l=0}
        
    }
    update(){
        this.route.data.subscribe((data) => { this.historique = data.historique })
        this.historique.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.historique.activeArticles.forEach(element => {
            this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.historique.mouvements.forEach(element => {
            this.Mouvements.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));
        this.articles = new MatTableDataSource<any>(this.active_articles);
        this.GetVentes()
    }
    getDate(ch: string) {
        return (ch.slice(0, 10))
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
    ngOnInit(): void { }
}
