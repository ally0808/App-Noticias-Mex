import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonAvatar, IonButton, IonIcon, IonList, 
  IonItem, IonInput, ActionSheetController, ToastController,
  NavController, IonModal, LoadingController // <-- 1. IMPORTAMOS LoadingController
} from '@ionic/angular/standalone'; 
import { DataService } from '../../services/data';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { addIcons } from 'ionicons';
import { 
  cameraOutline, imageOutline, closeOutline, 
  checkmarkCircleOutline, arrowBackOutline, logOutOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonButtons, IonAvatar, IonButton, 
    IonIcon, IonList, IonItem, IonInput, IonModal
  ]
})
export class PerfilPage implements OnInit {

  public dataService = inject(DataService);
  private actionSheetCtrl = inject(ActionSheetController);
  private toastCtrl = inject(ToastController);
  private navCtrl = inject(NavController);
  private loadingCtrl = inject(LoadingController); // <-- 2. INYECTAMOS el servicio

  isModalOpen = false; 
  
  constructor() {
    addIcons({ 
      cameraOutline, imageOutline, closeOutline, 
      checkmarkCircleOutline, arrowBackOutline, logOutOutline
    });
  }

  ngOnInit() {
    if (!this.dataService.usuarioLogueado()) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  async regresar() {
    await Haptics.impact({ style: ImpactStyle.Light });
    this.navCtrl.back();
  }

  verFoto() {
    this.isModalOpen = true;
  }

  // --- FUNCIÓN CERRAR SESIÓN ACTUALIZADA CON LOADING ---
  async cerrarSesion() {
    // 3. CREAMOS EL LOADING
    const loading = await this.loadingCtrl.create({
      message: 'Cerrando sesión...',
      spinner: 'crescent'
    });

    // 4. MOSTRAR EL LOADING Y VIBRACIÓN
    await loading.present();
    await Haptics.notification({ type: NotificationType.Warning });
    
    // Simulamos un pequeño retraso de 1.5 segundos
    setTimeout(async () => {
      // 5. QUITAMOS EL LOADING
      await loading.dismiss();

      // Actualizamos el Signal a null y navegamos
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
        {
          text: 'Usar Cámara',
          icon: 'camera-outline',
          handler: () => { this.obtenerImagen(CameraSource.Camera); }
        },
        {
          text: 'Elegir de Galería',
          icon: 'image-outline',
          handler: () => { this.obtenerImagen(CameraSource.Photos); }
        },
        {
          text: 'Cancelar',
          icon: 'close-outline',
          role: 'cancel'
        }
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
          usuarioActual.foto = image.webPath;
          this.dataService.usuarioLogueado.set({ ...usuarioActual });

          const index = this.dataService.usuarios.findIndex(
            u => u.correo === usuarioActual.correo
          );
          if (index !== -1) {
            this.dataService.usuarios[index].foto = image.webPath;
          }
        }

        this.mostrarMensaje('¡Foto de perfil actualizada!');
      }
    } catch (error) {
      console.log('Usuario canceló selección de imagen');
    }
  }

  async mostrarMensaje(texto: string) {
    const toast = await this.toastCtrl.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }
}