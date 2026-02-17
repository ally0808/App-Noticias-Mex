import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Usuario inicial (Simulacro de base de datos)
  public usuarios = [
    { nombre: 'Erik Loera', correo: 'erik@ejemplo.com', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' },
    { nombre: 'Jorge Lara', correo: 'jorge@ejemplo.com', foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' }
  ];

  public usuarioLogueado: any = null;
  public noticiaSeleccionada: any = null;

  public noticias = [
    { id: 1, titulo: 'Nueva Actualización Ionic', autor: 'Admin', desc: 'Ionic 7 ha llegado con mejoras en Standalone Components.', img: 'https://picsum.photos/id/1/400/300' },
    { id: 2, titulo: 'Clase de Programación', autor: 'Profesor', desc: 'Hoy se entrega la tarea de navegación y cámara.', img: 'https://picsum.photos/id/2/400/300' },
    { id: 3, titulo: 'PokeAPI Tips', autor: 'Erik', desc: 'Cómo optimizar las búsquedas en tu Pokedex.', img: 'https://picsum.photos/id/3/400/300' }
  ];

  constructor() { }
}