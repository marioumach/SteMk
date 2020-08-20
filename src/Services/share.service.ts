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

    constructor(private db: AngularFireDatabase,
        private snackBar: MatSnackBar,
        private http: HttpClient) { }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {
            const articles = this.getArticles().subscribe((articles) => {
                const mouvements = this.getArticles().subscribe((mouvements) => {
                const obj = {
                    articles: articles,
                    mouvements:mouvements
                };
                resolve(obj);

            })
        })
        })
    } 
    // CRUD Article
    getArticles() {
        const ref = this.db.list('Article').snapshotChanges();
        return ref;
    }
    addArticle(article: any) {
        const itemsRef = this.db.list('Article');
        return itemsRef.push(article);
    }
    UpdateArticle(article : any , key : string){
        const itemRef = this.db.object(`Article/${key}`);
        return itemRef.update(article);
    }
    deleteArticle(article: any) {
        const itemsRef = this.db.object(`Article/${article}`);
        return itemsRef.remove();
    }
    getArticle(key : string){
        return this.db.object(`Article/${key}`).snapshotChanges();
    }
    getMouvements() {
        const ref = this.db.list('Mouvement').snapshotChanges();
        return ref;
    }
    addMouvement(mouvement : any) {
        const itemsRef = this.db.list('Mouvement');
        return itemsRef.push(mouvement);
    }
    //snackbar
    showMsg(message: string) {
        this.snackBar.open(message, 'fermer', {
            duration: 3000
        })
    }

}