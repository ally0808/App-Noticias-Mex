import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonInput, IonButton, IonIcon, IonItem, IonList, 
  ToastController, AlertController 
} from '@ionic/angular/standalone';
import { DataService } from '../../services/data';
import { addIcons } from 'ionicons';
import { newspaperOutline, fingerPrintOutline } from 'ionicons/icons';

// Importamos el plugin de biometría
import { NativeBiometric } from "@capgo/capacitor-native-biometric";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonInput, IonButton, IonIcon, IonItem, IonList]
})
export class LoginPage {
  correo: string = '';
  clave: string = '';

  constructor(
    private dataService: DataService,
    private router: Router,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ newspaperOutline, fingerPrintOutline });
  }

  async iniciarSesion() {
    if (this.correo && this.clave) {
      const usuario = this.dataService.usuarios.find(
        u => u.correo === this.correo && u.password === this.clave
      );

      if (usuario) {
        // Guardamos para que la huella funcione después
        localStorage.setItem('user_email', this.correo);
        localStorage.setItem('user_pass', this.clave);

        this.dataService.usuarioLogueado = usuario;
        this.router.navigate(['/home']);
      } else {
        this.mostrarMensaje('Usuario o contraseña incorrectos', 'danger');
      }
    } else {
      this.mostrarMensaje('Por favor, llena todos los campos', 'warning');
    }
  }

  async loginConHuella() {
    try {
      const savedEmail = localStorage.getItem('user_email');
      const savedPass = localStorage.getItem('user_pass');

      if (!savedEmail || !savedPass) {
        this.mostrarMensaje('Inicia sesión manualmente primero una vez', 'warning');
        return;
      }

      await NativeBiometric.verifyIdentity({
        reason: "Acceso rápido",
        title: "Huella Digital",
        description: "Toca el sensor"
      });

      const usuario = this.dataService.usuarios.find(u => u.correo === savedEmail);
      if (usuario) {
        this.dataService.usuarioLogueado = usuario;
        this.router.navigate(['/home']);
      }
    } catch (e) {
      this.mostrarMensaje('Error de biometría', 'danger');
    }
  }

  async crearCuenta() {
    const alert = await this.alertCtrl.create({
      header: 'Registrarse',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre' },
        { name: 'correo', type: 'email', placeholder: 'Correo' },
        { name: 'password', type: 'password', placeholder: 'Contraseña' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (data.nombre && data.correo && data.password) {
              const nuevo = {
                nombre: data.nombre,
                correo: data.correo,
                password: data.password,
                foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
              };
              this.dataService.usuarios.push(nuevo);
              this.mostrarMensaje('¡Cuenta creada con éxito!', 'success');
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
      color: color
    });
    await toast.present();
  }
}