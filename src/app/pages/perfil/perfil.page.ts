import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, 
  IonAvatar, IonButton, IonIcon, IonList, 
  IonItem, IonInput, ActionSheetController, ToastController,
  NavController 
} from '@ionic/angular/standalone'; 
import { DataService } from '../../services/data';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { addIcons } from 'ionicons';
import { 
  cameraOutline, imageOutline, closeOutline, 
  checkmarkCircleOutline, arrowBackOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonButtons, IonAvatar, IonButton, 
    IonIcon, IonList, IonItem, IonInput
  ]
})
export class PerfilPage implements OnInit {
  
  constructor(
    public dataService: DataService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private navCtrl: NavController 
  ) {
    // Registramos los iconos que vamos a usar
    addIcons({ 
      cameraOutline, imageOutline, closeOutline, 
      checkmarkCircleOutline, arrowBackOutline 
    });
  }

  ngOnInit() {
    // Si por error entran aquí sin loguearse, los mandamos al login
    if (!this.dataService.usuarioLogueado) {
      this.navCtrl.navigateRoot('/login');
    }
  }

  // Función para que el botón de la flecha funcione siempre
  regresar() {
    this.navCtrl.back();
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
        // Guardamos la foto en el servicio
        this.dataService.usuarioLogueado.foto = image.webPath;
        
        // Actualizamos la lista global para que no se pierda al navegar
        const index = this.dataService.usuarios.findIndex(
          u => u.correo === this.dataService.usuarioLogueado.correo
        );
        if (index !== -1) {
          this.dataService.usuarios[index].foto = image.webPath;
        }

        this.mostrarMensaje('¡Foto de perfil actualizada!');
      }
    } catch (error) {
      console.log('El usuario cerró la cámara');
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