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

// FireBase
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireMessagingModule } from "@angular/fire/messaging";
import { AngularFireStorageModule  } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';

//Services
import { ShareService } from "src/services/share.service";

@NgModule({

  declarations: [
    AppComponent,
    CalculeComponent,
    DArticleComponent,
    CArticleComponent,
    UArticleComponent
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
  providers: [ShareService],
  bootstrap: [AppComponent]
})
export class AppModule { }
