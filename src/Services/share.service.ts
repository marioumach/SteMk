import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class ShareService {
    a : any = {Reference : 'EMPrimaqua11000', Designation : 'PrimaAqua'}

    constructor(private db: AngularFireDatabase,
        private snackBar: MatSnackBar,
        private http: HttpClient) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            const articles = this.getArticles().subscribe((articles) => {
                const obj = {
                    articles: articles
                };
                resolve(obj);

            })
        })
    }
    addArticle(article : any){
        const itemsRef = this.db.list('Article');
        return itemsRef.push(article);
    }
    getArticles() {
        const ref = this.db.list('Article').snapshotChanges();
        return ref;
    }
     //snackbar
  showMsg(message: string) {
    this.snackBar.open(message, 'fermer', {
      duration: 2000
    })
  }

}