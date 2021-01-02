import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ShareService } from 'src/services/share.service';
import { DMouvementComponent } from '../Modal/DMouvement.component';
import { MouvementsService } from './mouvements.service';

@Component({
    selector: 'app-mouvements',
    templateUrl: './mouvements.component.html',
    styleUrls: ['./mouvements.component.scss']
})
export class MouvementsComponent implements OnInit {
    options = { month: '2-digit', day: '2-digit', year: 'numeric' };
    loading = false;
    dateTime = new Date()
    d1 = this.dateTime.getDate()
    m1 = this.dateTime.getMonth() + 1
    y1 = this.dateTime.getFullYear()
    Y = new Date(this.m1 + '-' + this.d1 + '-' + this.y1)
    DateTime = this.Y.toLocaleDateString("en-US", this.options)
    Article_Caisse: string[] = ['action', 'Article', 'Qte', 'PU', 'Total'];
    Articles: any[] = [];
    Mouvements: any[] = [];
    active_articles: any[] = [];
    TVentes: any[] = [];
    dataSource = [];
    ventes: any[] = [];
    Ventes: any[] = [];
    Tventes: any[] = [];
    JVentes: any[] = [];
    mouvements: any
    mvts: any
    mouvement: any = {};

    Stock_columns: string[] = ['reference', 'designation', 'date', 'operation', 'acteur', 'quantité', 'prix', 'valeur', 'actions']
    operation = new FormControl('Entrée', Validators.required);
    acteur = new FormControl('', Validators.required);
    article = new FormControl('', Validators.required);
    date = new FormControl('', Validators.required);
    quantite = new FormControl('', Validators.required);
    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private MouvementsService: MouvementsService,
        private shareService: ShareService) {
        this.route.data.subscribe((data) => { this.mouvements = data.mouvements })
        this.mouvements.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.mouvements.activeArticles.forEach(element => {
            this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.mouvements.mouvements.forEach(element => {
            let m: any
            m = element.payload.val()
            this.Mouvements.push({ key: element.key, ...element.payload.val() as {} , reference: this.getArticle(m.article).reference, designation: this.getArticle(m.article).designation })
        })
        this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));
        this.mvts = new MatTableDataSource<any>(this.Mouvements);

    }
     FiltrerMouvement(filterValue: string) {
        this.mvts.filter = filterValue.trim().toLowerCase();
    }
    AjoutMouvement() {
        this.loading = true
        let i = this.active_articles.findIndex(i => i.key === this.mouvement.article);
        let qte = this.getArticle(this.mouvement.article).quantite
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
                this.MouvementsService.addMouvement(obj).then(() => {
                    this.MouvementsService.updateArticleQte(obj.article, qte).then(() => {
                        this.MouvementsService.showMsg("Mouvement ajouté avec succès");
                        this.operation.reset()
                    }).catch(error => {
                        this.MouvementsService.showMsg("Erreur Modifier quantite article");

                    })
                }).catch(error => {
                    this.MouvementsService.showMsg("Erreur Ajouter Mouvement");
                    this.MouvementsService.showMsg(error.message);
                });
            }
            else {
                this.MouvementsService.showMsg("La Quantité en stock est insuffisante")
            }
        }
        this.loading = false
        this.getMouvements()
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
        this.mouvements.ventes.forEach(element => {
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
    get isValidInventaire(): boolean {
        return this.mouvement.operation === '' || this.mouvement.acteur === '' || this.mouvement.article === '' || this.mouvement.date === '' || this.mouvement.quantite === 0
    }
    openSupprimeMouvement(element: any): void {
        const dialogRef = this.dialog.open(DMouvementComponent, {
            width: '600px',
            panelClass: 'app-full-bleed-dialog',
            data: element
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getMouvements()
        });
    }
    getMouvements() {
        this.shareService.getMouvements().subscribe(data => {
            this.Mouvements = [];
            data.forEach(element => {
                let m: any
                m = element.payload.val()
                this.Mouvements.push({ key: element.key, ...element.payload.val() as {}, reference: this.getArticle(m.article).reference, designation: this.getArticle(m.article).designation })
                const a = this.shareService.getArticle(this.Mouvements[this.Mouvements.length - 1].article)
            })
            this.mvts = new MatTableDataSource<any>(this.Mouvements);
        })
    }
    ngOnInit(): void { }
}
