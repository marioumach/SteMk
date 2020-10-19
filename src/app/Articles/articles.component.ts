import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ShareService } from 'src/services/share.service';
import { CArticleComponent } from '../Modal/CArticle.component';
import { DArticleComponent } from '../Modal/DArticle.component';
import { UArticleComponent } from '../Modal/UArticle.component';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
    active_articles: any[]=[];
    Articles: any[] = [];
    articles:any
    article:any
    Article_columns: string[] = ['reference', 'designation', 'stockMin', 'quantite', 'Palette', 'prixAchat', 'prixVente', 'dateAjout', 'actions'];
    @ViewChild('sortA') sortA: MatSort;

    constructor(public dialog: MatDialog,
        private route: ActivatedRoute,
        private shareService : ShareService ) {
        this.route.data.subscribe((data) => { this.articles = data.articles })
        this.articles.articles.forEach(element => {
            this.Articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.articles.activeArticles.forEach(element => {
            this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));
        this.article = new MatTableDataSource<any>(this.active_articles);
    }
    getArticles(){
      this.shareService.getActiveArticles().subscribe(data => {
        this.active_articles = [];
        data.forEach(element => {
          this.active_articles.push({ key: element.key, ...element.payload.val() as {} })
        })
        this.active_articles.sort((a, b) => (a.reference > b.reference) ? 1 : ((b.reference > a.reference) ? -1 : 0));
        console.log(this.active_articles)
        this.article = new MatTableDataSource<any>(this.active_articles);
        this.article.sort = this.sortA;
      })
      
    }
    FiltrerArticles(filterValue: string) {
        this.article.filter = filterValue.trim().toLowerCase();
      }
      Nombre(total): any {
        return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      };
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
      openAjoutArticle(): void {
        const dialogRef = this.dialog.open(CArticleComponent, {
          maxWidth: '600px',
          panelClass: 'app-full-bleed-dialog',
          data: this.Articles.length
    
        });
    
        dialogRef.afterClosed().subscribe(result => {
        this.getArticles()        });
      }
      openEditArticle(element: any): void {
        const dialogRef = this.dialog.open(UArticleComponent, {
          width: '600px',
          panelClass: 'app-full-bleed-dialog',
          data: element
    
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.getArticles()         });
      }
      openSupprimeArticle(element: any): void {
        const dialogRef = this.dialog.open(DArticleComponent, {
          width: '600px',
          panelClass: 'app-full-bleed-dialog',
          data: element
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.getArticles()         });
      }
    ngOnInit(): void { }
}
