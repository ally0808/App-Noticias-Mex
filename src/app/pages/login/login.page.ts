import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonInput, IonButton, IonIcon, IonItem, IonList, 
  ToastController, AlertController, LoadingController // <-- 1. Agregamos LoadingController
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
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon, IonItem, IonList]
})
export class LoginPage {
  correo: string = '';
  clave: string = '';

  // Inyección de servicios
  public dataService = inject(DataService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private loadingCtrl = inject(LoadingController); // <-- 2. Inyectamos el servicio

  constructor() {
    addIcons({ newspaperOutline, fingerPrintOutline });
  }

  async iniciarSesion() {
    if (this.correo && this.clave) {
      
      // 3. CREAR EL COMPONENTE DE CARGA
      const loading = await this.loadingCtrl.create({
  message: 'Validando credenciales...',
  spinner: 'crescent'
  // color: 'danger' <-- Borra esta línea para eliminar el error
});
      // 4. MOSTRAR EL SPINNER
      await loading.present();

      const usuario = this.dataService.usuarios.find(
        u => u.correo.toLowerCase() === this.correo.toLowerCase() && u.password === this.clave
      );

      // Simulamos un retraso de 1.5 segundos para que se aprecie el spinner
      setTimeout(async () => {
        
        // 5. QUITAR EL SPINNER antes de navegar o mostrar error
        await loading.dismiss();

        if (usuario) {
          console.log('📳 Haptics: IMPACTO MEDIO - Login Correcto');
          await Haptics.impact({ style: ImpactStyle.Medium });
          
          localStorage.setItem('user_email', this.correo);
          this.dataService.usuarioLogueado.set(usuario);
          this.router.navigate(['/home']);
        } else {
          console.log('📳 Haptics: NOTIFICACIÓN ERROR - Datos incorrectos');
          await Haptics.notification({ type: NotificationType.Error });
          this.mostrarMensaje('Usuario o contraseña incorrectos', 'danger');
        }
      }, 1500);

    } else {
      this.mostrarMensaje('Por favor, llena todos los campos', 'warning');
    }
  }

  // --- El resto de tus funciones se mantienen igual ---

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
        console.log('📳 Haptics: IMPACTO LIGERO - Huella detectada');
        await Haptics.impact({ style: ImpactStyle.Light });
        this.dataService.usuarioLogueado.set(usuario);
        this.router.navigate(['/home']);
      }
    } catch (e) {
      await Haptics.notification({ type: NotificationType.Error });
      this.mostrarMensaje('Autenticación cancelada', 'danger');
    }
  }

  async crearCuenta() {
    const alert = await this.alertCtrl.create({
      header: 'Nueva Cuenta',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre completo' },
        { name: 'correo', type: 'email', placeholder: 'Correo electrónico' },
        { name: 'password', type: 'password', placeholder: 'Contraseña' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Registrar',
          handler: async (data) => {
            if (data.nombre && data.correo && data.password) {
              const nuevoUsuario = {
                nombre: data.nombre,
                correo: data.correo,
                password: data.password,
                foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
              };
              this.dataService.usuarios.push(nuevoUsuario);
              await Haptics.notification({ type: NotificationType.Success });
              this.mostrarMensaje('Cuenta creada con éxito', 'success');
            }
          }
        }
      ]
    });
    await alert.present();
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