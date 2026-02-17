import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular/standalone';
// AGREGA ESTO: Importar los componentes que faltan
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  // ACTUALIZA ESTO: Agrega IonApp e IonRouterOutlet aquí
  imports: [IonApp, IonRouterOutlet], 
})
export class AppComponent implements OnInit {
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.configurarStatusBar();
  }

  async configurarStatusBar() {
    await this.platform.ready();
    if (this.platform.is('hybrid')) {
      await StatusBar.setBackgroundColor({ color: '#eb445a' });
      await StatusBar.setStyle({ style: Style.Dark });
    }
  }
}