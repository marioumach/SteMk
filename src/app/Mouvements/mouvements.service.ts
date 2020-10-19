import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class MouvementsService {
    constructor(private db: AngularFireDatabase,
        private snackBar: MatSnackBar,
        private http: HttpClient,
        private storage: AngularFireStorage) { }
    updateArticleQte(uid: string, qte : number) {
        const itemref = this.db.object('Article/' + uid);
        return itemref.update({ quantite: qte});
      }
      horizontalPosition: MatSnackBarHorizontalPosition = 'right';
        verticalPosition: MatSnackBarVerticalPosition = 'bottom';
          showMsg(message: string) {
              this.snackBar.open(message, '', {
                  duration: 5000,
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
              })
          }
          addMouvement(mouvement : any) {
            const itemsRef = this.db.list('Mouvement');
            return itemsRef.push(mouvement);
        }
        deleteMouvement(mouvement: any) {
            const itemsRef = this.db.object(`Mouvement/${mouvement}`);
            return itemsRef.remove();
        }
        //snackbar
             


}
