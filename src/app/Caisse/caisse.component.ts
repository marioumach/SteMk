import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { CalculeComponent } from '../Modal/calcule.component';
import { CaisseService } from './caisse.service';
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
    selector: 'app-caisse',
    templateUrl: './caisse.component.html',
    styleUrls: ['./caisse.component.scss']
})

export class CaisseComponent implements OnInit {
    //declarations
    caisse: any
    options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    dateTime = new Date()
    d1 = this.dateTime.getDate()
    m1 = this.dateTime.getMonth() + 1
    y1 = this.dateTime.getFullYear()
    Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
    DateTime = this.Y.toLocaleDateString("en-US", this.options)
    Article_Caisse: string[] = ['action', 'Article', 'Qte', 'PU', 'Total'];
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

    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private caisseService: CaisseService) {
 this.update()
 
    }
    supprimer(i) {

        this.dataSource.splice(i, 1);
        this.dataSource = [...this.dataSource]
      }
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
    annuler() {
        this.dataSource = [];
    }
    passer() {
        this.loading = true;
        this.caisseService.addVente(this.dataSource).then(() => {
            this.dataSource.forEach((element) => {
                let i = this.active_articles.findIndex(i => i.key === element.article);
                let qte = this.getReste(this.getArticle(element.article), i)
                this.caisseService.updateArticleQte(element.article, qte).catch(erreur => {
                    this.caisseService.showMsg("erreur Modififer quantite article")
                })
            });
            this.l+=1;
            this.dataSource = []
            this.loading = false;
        })
            .catch(error => {
                console.error(error.message);
                this.caisseService.showMsg("Erreur Passer vente");
                this.loading = false;

            });
    }
    getArticle(key: string): any {
        const index = this.Articles.map(e => e.key).indexOf(key);
        return this.Articles[index];
    }
    getReste(item, j) {
        return this.getTotalArticleEntree(item.key) - this.getTotalArticleVendu(j) - this.getTotalArticleSorti(item.key)

    }
    getTotalprix() {
        return this.dataSource.map(t => t.prixUnit * t.quantite).reduce((acc, value) => acc + value, 0);
      }
      Nombre(total): any {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      };
    getTotalArticleSorti(j: any) {
        let qte = 0
        this.Mouvements.forEach(mouvement => {
            if (j == mouvement.article && mouvement.operation == 'Sortie')
                qte += mouvement.quantite

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
    get isValidVente(): boolean {
        return this.dataSource.length == 0
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
    getDate(ch: string) {
        return (ch.slice(0, 10))
    }
    GetVentes() {
        let i = 0
        this.caisse.ventes.forEach(element => {
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
        this.l=this.TVentes.length
    
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
ngOnInit(): void {
}
    update(){
        this.route.data.subscribe((data) => { this.caisse = data.caisse })
        this.caisse.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.caisse.activeArticles.forEach(element => {
            this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.caisse.mouvements.forEach(element => {
            this.Mouvements.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));
        this.articles = new MatTableDataSource<any>(this.active_articles);
        this.GetVentes()
    }

}
