import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonAvatar, IonButton, IonIcon, IonList, 
  IonItem, IonInput, ActionSheetController, ToastController,
  NavController, IonModal 
} from '@ionic/angular/standalone'; 
import { DataService } from '../../services/data';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
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

  isModalOpen = false; // Controla si se ve la foto en grande
  
  constructor(
    public dataService: DataService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private navCtrl: NavController 
  ) {
    // Registramos todos los iconos necesarios
    addIcons({ 
      cameraOutline, imageOutline, closeOutline, 
      checkmarkCircleOutline, arrowBackOutline, logOutOutline
    });
  }

  ngOnInit() {
    // Validación de seguridad
    if (!this.dataService.usuarioLogueado) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  regresar() {
    this.navCtrl.back();
  }

  // Función para abrir el modal
  verFoto() {
    this.isModalOpen = true;
  }

  async cerrarSesion() {
    this.dataService.usuarioLogueado = null;
    this.navCtrl.navigateRoot('/login');
    this.mostrarMensaje('Sesión cerrada correctamente');
  }

  async cambiarFoto() {
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
        this.dataService.usuarioLogueado.foto = image.webPath;
        
        const index = this.dataService.usuarios.findIndex(
          u => u.correo === this.dataService.usuarioLogueado.correo
        );
        if (index !== -1) {
          this.dataService.usuarios[index].foto = image.webPath;
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