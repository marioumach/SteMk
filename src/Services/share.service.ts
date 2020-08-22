import { Injectable } from '@angular/core';
import { AngularFireDatabase } from "@angular/fire/database";
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
@Injectable({ providedIn: 'root' })
export class ShareService {

    constructor(private db: AngularFireDatabase,
        private snackBar: MatSnackBar,
        private http: HttpClient,
        private storage: AngularFireStorage) { }
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
    articleImg$: BehaviorSubject<string> = new BehaviorSubject<string>("./assets/images/Bouteille.png");
    getArticleImage() {
        return this.articleImg$.asObservable();
      }
    setArticleImage(croppedFile: string){
        this.articleImg$.next(croppedFile);
    }
    // Set Image
    uploadArticleImage(file, key: string) {
        console.log(key)
        const filePath ='Article/'+key+'.png' 
        console.log(filePath)
        const fileRef = this.storage.ref(filePath);
        console.log(fileRef)
        this.storage.upload(filePath, file).then(() => {
            fileRef.getDownloadURL().subscribe((url: string) => {
                console.log(url)
            this.updateArticleImage(key, url).then(() => {
              this.showMsg('Image Sauvegardée avec succès')
            }).catch((error)=>{
                this.showMsg(error)
            })
          })
        });
      }
    updateArticleImage(uid: string, url: string) {
        const itemref = this.db.object('Article/' + uid);
        return itemref.update({ image: url});
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