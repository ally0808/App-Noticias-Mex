import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonAvatar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonText, IonIcon, IonRefresher, IonRefresherContent,
  IonSkeletonText, IonThumbnail, 
  ToastController // <-- 1. Se mantiene aquí (Importación de archivo)
} from '@ionic/angular/standalone';
import { DataService } from '../services/data';
import { addIcons } from 'ionicons';
import { 
  newspaperOutline, arrowForwardCircleOutline, 
  chevronDownCircleOutline, checkmarkCircleOutline 
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonButtons, IonButton, IonAvatar, 
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonText, IonIcon, IonRefresher, IonRefresherContent,
    IonSkeletonText, IonThumbnail
    // <-- 2. AQUÍ YA NO VA ToastController (Por eso te daba error)
  ],
})
export class HomePage implements OnInit {
  public dataService = inject(DataService);
  public router = inject(Router);
  
  // 3. AQUÍ ES DONDE REALMENTE SE ACTIVA LA FUNCIÓN
  private toastCtrl = inject(ToastController);

  cargando: boolean = true;

  constructor() {
    addIcons({ 
      newspaperOutline, arrowForwardCircleOutline, 
      chevronDownCircleOutline, checkmarkCircleOutline 
    });
  }

  ngOnInit() {
    setTimeout(() => { this.cargando = false; }, 2000);
  }

  async handleRefresh(event: any) {
    this.cargando = true;
    await Haptics.impact({ style: ImpactStyle.Light });

    setTimeout(async () => {
      this.cargando = false;
      event.target.complete(); 
      
      // La función sigue funcionando perfectamente
      await this.mostrarToast('Noticias actualizadas correctamente', 'success');
      
      await Haptics.impact({ style: ImpactStyle.Medium });
    }, 1500);
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'bottom',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  async verDetalle(noticia: any) {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.dataService.noticiaSeleccionada.set(noticia);
    this.router.navigate(['/detalle']);
  }
}