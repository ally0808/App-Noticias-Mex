import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    // Solo se ejecuta si estás en un celular real (Android/iOS)
    if (Capacitor.isNativePlatform()) {
      await StatusBar.setStyle({ style: Style.Light }); // Letras oscuras (hora, batería)
      await StatusBar.setBackgroundColor({ color: '#ffffff' }); // Fondo blanco
    }
  }
}