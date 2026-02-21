import { Component, inject, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonButtons, 
  IonBadge, IonText, IonIcon, IonButton,
  IonAvatar, NavController, ToastController, // <-- Eliminamos IonSpinner
  IonSkeletonText 
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
import { addIcons } from 'ionicons';
import { 
  shareSocialOutline, 
  arrowBackOutline, 
  closeOutline, 
  shareOutline 
} from 'ionicons/icons';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics'; 

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBadge, 
    IonText, 
    IonIcon, 
    IonButton, 
    IonAvatar, 
    // IonSpinner se elimina de aquí para quitar el amarillo
    IonSkeletonText
  ]
})
export class DetallePage implements OnInit {
  public dataService = inject(DataService);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);

  cargando: boolean = true; 

  constructor() {
    addIcons({ 
      shareSocialOutline, 
      arrowBackOutline, 
      closeOutline, 
      shareOutline 
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.cargando = false;
    }, 1500);
  }

  async regresar() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.navCtrl.back();
  }

  async compartir() {
    const noticia = this.dataService.noticiaSeleccionada();

    if (noticia) {
      await Haptics.impact({ style: ImpactStyle.Medium });
      
      const toast = await this.toastCtrl.create({
        message: 'Preparando opciones para compartir...',
        duration: 1200,
        color: 'dark',
        icon: 'share-social-outline'
      });
      await toast.present();

      try {
        await Share.share({
          title: noticia.titulo,
          text: `Lee esto en Noticias Mex: ${noticia.titulo}`,
          url: 'https://noticiasmex.com.mx',
          dialogTitle: 'Compartir noticia',
        });
      } catch (error) {
        console.log('Compartido cancelado');
      }
    }
  }
}