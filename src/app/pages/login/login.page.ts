import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonInput, IonButton, IonIcon, IonItem, IonList, 
  ToastController, AlertController, LoadingController,
  IonSegment, IonSegmentButton, IonLabel 
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
import { addIcons } from 'ionicons';
import { newspaperOutline, fingerPrintOutline } from 'ionicons/icons';
import { NativeBiometric } from "@capgo/capacitor-native-biometric";
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonInput, IonButton, 
    IonIcon, IonItem, IonList, IonSegment, IonSegmentButton, IonLabel
  ]
})
export class LoginPage {
  correo: string = '';
  clave: string = '';
  nombreNuevo: string = '';
  modoRegistro: boolean = false; 

  public dataService = inject(DataService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController);

  constructor() {
    addIcons({ newspaperOutline, fingerPrintOutline });
  }

  async vibrarMedio() {
    await Haptics.impact({ style: ImpactStyle.Medium });
  }

  async iniciarSesion() {
    if (this.correo && this.clave) {
      const loading = await this.loadingCtrl.create({
        message: 'Validando credenciales...',
        spinner: 'crescent'
      });
      await loading.present();

      const usuario = this.dataService.usuarios.find(
        u => u.correo.toLowerCase() === this.correo.toLowerCase() && u.password === this.clave
      );

      setTimeout(async () => {
        await loading.dismiss();

        if (usuario) {
          await Haptics.impact({ style: ImpactStyle.Medium });
          localStorage.setItem('user_email', this.correo);

          // --- RECUPERAR FOTO GUARDADA ---
          const fotoGuardada = localStorage.getItem(`foto_${usuario.correo}`);
          if (fotoGuardada) {
            usuario.foto = fotoGuardada;
          }
          // -------------------------------

          this.dataService.usuarioLogueado.set(usuario);
          this.router.navigate(['/home']);
        } else {
          await Haptics.notification({ type: NotificationType.Error });
          this.mostrarMensaje('Usuario o contraseña incorrectos', 'danger');
        }
      }, 1500);
    } else {
      this.mostrarMensaje('Por favor, llena todos los campos', 'warning');
    }
  }

  async crearCuentaNueva() {
    if (this.nombreNuevo && this.correo && this.clave) {
      const nuevoUsuario = {
        nombre: this.nombreNuevo,
        correo: this.correo,
        password: this.clave,
        foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
      };
      this.dataService.usuarios.push(nuevoUsuario);
      await Haptics.notification({ type: NotificationType.Success });
      this.mostrarMensaje('Cuenta creada con éxito', 'success');
      this.modoRegistro = false; 
    } else {
      this.mostrarMensaje('Llena todos los campos para registrarte', 'warning');
    }
  }

  async loginConHuella() {
    try {
      const savedEmail = localStorage.getItem('user_email');
      if (!savedEmail) {
        this.mostrarMensaje('Inicia sesión manualmente primero', 'warning');
        return;
      }
      await NativeBiometric.verifyIdentity({
        reason: "Acceso rápido",
        title: "Huella Digital",
        description: "Toca el sensor"
      });
      
      const usuario = this.dataService.usuarios.find(u => u.correo === savedEmail);
      
      if (usuario) {
        await Haptics.impact({ style: ImpactStyle.Light });

        // --- RECUPERAR FOTO GUARDADA (TAMBIÉN EN HUELLA) ---
        const fotoGuardada = localStorage.getItem(`foto_${usuario.correo}`);
        if (fotoGuardada) {
          usuario.foto = fotoGuardada;
        }
        // ---------------------------------------------------

        this.dataService.usuarioLogueado.set(usuario);
        this.router.navigate(['/home']);
      }
    } catch (e) {
      await Haptics.notification({ type: NotificationType.Error });
      this.mostrarMensaje('Autenticación fallida');
    }
  }

  async mostrarMensaje(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({ 
      message: mensaje, 
      duration: 2000, 
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}