import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonBadge, IonText, IonIcon, IonButton,
  IonAvatar,  
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
import { addIcons } from 'ionicons';
import { shareSocialOutline, arrowBackOutline } from 'ionicons/icons'; // Agregué flecha atrás

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, 
    IonToolbar, IonButtons, IonBackButton, IonBadge, 
    IonText, IonIcon, IonButton, IonAvatar, 
  ]
})
export class DetallePage {
  constructor(public dataService: DataService) {
    // Registramos iconos
    addIcons({ shareSocialOutline, arrowBackOutline });
  }
}