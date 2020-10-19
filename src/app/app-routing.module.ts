import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareService } from 'src/services/share.service';
import { ArticlesComponent } from './Articles/articles.component';
import { CaisseComponent } from './Caisse/caisse.component';
import { HistoriqueComponent } from './Historique/historique.component';
import { MouvementsComponent } from './Mouvements/mouvements.component';
import { VenteJoursComponent } from './VenteJours/venteJours.component';
import { VentesComponent } from './Ventes/ventes.component';

const routes: Routes = [
  { path: 'mouvements', component: MouvementsComponent , resolve:{mouvements : ShareService} },
  { path: 'articles', component: ArticlesComponent, resolve:{articles : ShareService} },
  { path: 'caisse', component: CaisseComponent, resolve:{caisse : ShareService}  },
  { path: 'ventes', component: VentesComponent, resolve:{ventes : ShareService} },
  { path: 'vente-jours', component: VenteJoursComponent,resolve:{venteJours : ShareService}  },
  { path: 'historique', component: HistoriqueComponent,resolve:{historique : ShareService}  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
