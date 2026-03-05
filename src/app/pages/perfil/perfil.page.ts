import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonAvatar, IonButton, IonIcon, IonList, 
  IonItem, IonInput, ActionSheetController, ToastController,
  NavController, IonModal, LoadingController, AlertController 
} from '@ionic/angular/standalone'; 

import { DataService } from '../../services/data'; 
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { addIcons } from 'ionicons';
import { 
  cameraOutline, imageOutline, closeOutline, 
  checkmarkCircleOutline, arrowBackOutline, logOutOutline, locationOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonButtons, 
    IonAvatar, 
    IonButton, 
    IonIcon, 
    IonList, 
    IonItem, 
    IonInput, 
    IonModal
  ]
})
export class PerfilPage implements OnInit {

  public dataService = inject(DataService);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);
  private navCtrl = inject(NavController);
  private loadingCtrl = inject(LoadingController);
  private alertCtrl = inject(AlertController);

  isModalOpen = false; 
  
  constructor() {
    addIcons({ 
      cameraOutline, imageOutline, closeOutline, 
      checkmarkCircleOutline, arrowBackOutline, logOutOutline, locationOutline
    });
  }

  ngOnInit() {
    if (!this.dataService.usuarioLogueado()) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  async obtenerUbicacion() {
    await Haptics.impact({ style: ImpactStyle.Medium });
    const loading = await this.loadingCtrl.create({
      message: 'Obteniendo coordenadas...',
      spinner: 'bubbles'
    });
    await loading.present();

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      await loading.dismiss();
      
      const alert = await this.alertCtrl.create({
        header: 'Ubicación Actual',
        message: `Latitud: ${coordinates.coords.latitude}\nLongitud: ${coordinates.coords.longitude}`,
        buttons: ['OK']
      });
      await alert.present();
    } catch (e) {
      await loading.dismiss();
      this.mostrarMensaje('Error al obtener ubicación. Revisa los permisos.');
    }
  }

  async regresar() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.navCtrl.back();
  }

  async verFoto() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.isModalOpen = true;
  }

  async cerrarSesion() {
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent'
    });
    await loading.present();
    await Haptics.notification({ type: NotificationType.Warning });
    
    setTimeout(async () => {
      await loading.dismiss();
      this.dataService.usuarioLogueado.set(null);
      this.navCtrl.navigateRoot('/login');
      this.mostrarMensaje('Sesión cerrada correctamente');
    }, 1500);
  }

  async cambiarFoto() {
    await Haptics.impact({ style: ImpactStyle.Medium });
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actualizar foto de perfil',
      buttons: [
        { text: 'Usar Cámara', icon: 'camera-outline', handler: () => { this.obtenerImagen(CameraSource.Camera); } },
        { text: 'Elegir de Galería', icon: 'image-outline', handler: () => { this.obtenerImagen(CameraSource.Photos); } },
        { text: 'Cancelar', icon: 'close-outline', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async obtenerImagen(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false, 
        resultType: CameraResultType.Uri, 
        source: source
      });

      if (image && image.webPath) {
        await Haptics.notification({ type: NotificationType.Success });
        const usuarioActual = this.dataService.usuarioLogueado();
        
        if (usuarioActual) {
          // 1. Guardamos la ruta en LocalStorage usando el correo como llave
          localStorage.setItem(`foto_${usuarioActual.correo}`, image.webPath);

          // 2. Actualizamos el estado actual
          this.dataService.usuarioLogueado.set({ 
            ...usuarioActual, 
            foto: image.webPath 
          });
        }
        this.mostrarMensaje('¡Foto de perfil actualizada!');
      }
    } catch (error) {
      console.log('Usuario canceló la cámara');
    }
  }

  async mostrarMensaje(texto: string) {
    const toast = await this.toastCtrl.create({
      message: texto,
      duration: 2000,
      color: 'dark',
      position: 'bottom'
    });
    await toast.present();
  }
}