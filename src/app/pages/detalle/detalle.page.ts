import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonBadge, IonText, IonIcon, IonButton,
  IonAvatar 
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
import { addIcons } from 'ionicons';
import { shareSocialOutline, arrowBackOutline } from 'ionicons/icons';

// 1. Importar el plugin Share
import { Share } from '@capacitor/share';

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
    addIcons({ shareSocialOutline, arrowBackOutline });
  }

  // 2. Función para compartir
  async compartir() {
    const noticia = this.dataService.noticiaSeleccionada;

    if (noticia) {
      await Share.share({
        title: noticia.titulo,
        text: `¡Mira esta noticia en Noticias Mex!: ${noticia.titulo}\n\n${noticia.desc}`,
        url: 'http://noticiasmex.com.mx', // Puedes poner un link real o inventado
        dialogTitle: 'Compartir noticia',
      });
    }
  }
}