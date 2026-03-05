import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonButtons, IonButton, IonAvatar, IonCard, 
  IonCardHeader, IonCardTitle, IonCardContent, 
  IonText, IonIcon, IonRefresher, IonRefresherContent,
  IonSkeletonText, IonThumbnail, 
  ToastController,
  IonInfiniteScroll, IonInfiniteScrollContent 
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
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
    IonSkeletonText, IonThumbnail,
    IonInfiniteScroll, IonInfiniteScrollContent 
  ],
})
export class HomePage implements OnInit {
  public dataService = inject(DataService);
  public router = inject(Router);
  private toastCtrl = inject(ToastController);

  cargando: boolean = true;

  constructor() {
    addIcons({ 
      newspaperOutline, arrowForwardCircleOutline, 
      chevronDownCircleOutline, checkmarkCircleOutline 
    });
  }

  ngOnInit() {
    this.cargarNoticias();
  }

  cargarNoticias(event?: any) {
    const nuevas = this.dataService.getMasNoticias(3);
    this.dataService.noticias.update(actuales => [...actuales, ...nuevas]);

    if (this.cargando) {
      setTimeout(() => { this.cargando = false; }, 2000);
    }

    if (event) {
      event.target.complete();
    }
  }

  async onInfinite(event: any) {
    // Agregamos haptics al cargar más
    await Haptics.impact({ style: ImpactStyle.Light });
    setTimeout(() => {
      this.cargarNoticias(event);
    }, 1000);
  }

  async handleRefresh(event: any) {
    this.cargando = true;
    await Haptics.impact({ style: ImpactStyle.Medium });
    
    this.dataService.noticias.set([]);
    
    setTimeout(async () => {
      this.cargarNoticias();
      event.target.complete(); 
      await this.mostrarToast('Noticias actualizadas correctamente', 'success');
      await Haptics.impact({ style: ImpactStyle.Light });
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
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.dataService.noticiaSeleccionada.set(noticia);
    this.router.navigate(['/detalle']);
  }
}