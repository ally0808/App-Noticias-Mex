import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonAvatar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonText, IonIcon 
} from '@ionic/angular/standalone';

// INTENTA CON ESTA RUTA (He ajustado los niveles)
import { DataService } from '../services/data'; 

import { addIcons } from 'ionicons';
import { newspaperOutline, arrowForwardCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonButtons, IonButton, IonAvatar, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonText, IonIcon
  ],
})
export class HomePage {

  // Si la línea 33 falla, es porque el import de arriba no funciona
  constructor(
    public router: Router, 
    public dataService: DataService
  ) {
    addIcons({ newspaperOutline, arrowForwardCircleOutline });
  }

  verDetalle(noticia: any) {
    if (noticia) {
      this.dataService.noticiaSeleccionada = noticia;
      this.router.navigate(['/detalle']);
    }
  }
}