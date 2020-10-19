//Angular 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CdkTableModule} from '@angular/cdk/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatangModule } from "src/assets/matang.module";
import { MatTableModule} from '@angular/material/table';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

// Modal CRUD Facture
import { CalculeComponent } from "./Modal/calcule.component";

// Modal CRUD Article
import { DArticleComponent } from "./Modal/DArticle.component";
import { CArticleComponent } from "./Modal/CArticle.component";
import { UArticleComponent } from "./Modal/UArticle.component";

//Delete Mouvement
import { DMouvementComponent } from "./Modal/DMouvement.component";
//Echange Modal
import { EchangeComponent} from "./Modal/echange.component";
//Delete Vente
import { DVenteComponent } from "./Modal/DVente.component";
// FireBase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireStorageModule,BUCKET  } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';

//Services
import { ShareService } from "src/services/share.service";
import { VentesComponent } from "src/app/Ventes/ventes.component";
import { ArticlesComponent} from "src/app/Articles/articles.component";
import { CaisseComponent } from "src/app/Caisse/caisse.component";
import { HistoriqueComponent } from "src/app/Historique/historique.component";
import { MouvementsComponent } from "src/app/Mouvements/mouvements.component";
import { NavBarComponent } from "src/app/NavBar/navbar.component";
import { VenteJoursComponent } from "src/app/VenteJours/venteJours.component";

import { VentesService } from "src/app/Ventes/ventes.service";
import { CaisseService } from "src/app/Caisse/caisse.service";
import { HistoriqueService } from "src/app/Historique/historique.service";
import { MouvementsService } from "src/app/Mouvements/mouvements.service";
import { NavBarService } from "src/app/NavBar/navbar.service";
import { VenteJoursService } from "src/app/VenteJours/venteJours.service";


@NgModule({

  declarations: [
    VentesComponent,
    ArticlesComponent,
    CaisseComponent,
    HistoriqueComponent,
    MouvementsComponent,
    NavBarComponent,
    VenteJoursComponent,
    AppComponent,
    CalculeComponent,
    DArticleComponent,
    CArticleComponent,
    UArticleComponent,
    DMouvementComponent,
    DVenteComponent,
    EchangeComponent
  ],
  imports: [
    //firebase
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireMessagingModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatangModule,
    CdkTableModule,
    MatTableModule,
    FlexLayoutModule,
    HttpClientModule,

  ],
  providers: [ShareService,
    VentesService,
    CaisseService,
    HistoriqueService,
    MouvementsService,
    NavBarService,
    VenteJoursService,
    , { provide: BUCKET, useValue: 'stemk-4bf9d.appspot.com' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
