import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
  // Lista maestra de usuarios
  public usuarios: any[] = [
    { 
      nombre: 'Allyson Loera', 
      correo: 'c230505352@utcalvillo.edu.mx', 
      password: 'allyMickey08', 
      foto: 'https://ionicframework.com/docs/img/demos/avatar.svg' 
    },
    {
      nombre: 'Profe Jorge', 
      correo: 'jorge@utcalvillo.edu.mx', 
      password: '1234', 
      foto: 'https://ionicframework.com/docs/img/demos/avatar.svg'
    }
  ];

  public usuarioLogueado: any = null;
  public noticiaSeleccionada: any = null;

  // Lista de 10 noticias reales con imágenes descriptivas
  public noticias = [
    { 
      id: 1, 
      titulo: 'Exploración Espacial: Rumbo a Marte', 
      autor: 'NASA News', 
      desc: 'Nuevos avances en el cohete SLS prometen reducir el tiempo de viaje al planeta rojo en la próxima década.', 
      img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&h=300&fit=crop' 
    },
    { 
      id: 2, 
      titulo: 'IA Revoluciona el Desarrollo de Software', 
      autor: 'Tech Insider', 
      desc: 'Herramientas de inteligencia artificial ahora pueden generar código complejo, ayudando a programadores a ser más eficientes.', 
      img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop' 
    },
    { 
      id: 3, 
      titulo: 'Avance en Energías Limpias', 
      autor: 'Green Energy Journal', 
      desc: 'Científicos logran un récord de eficiencia en paneles solares transparentes que podrían usarse en ventanas de edificios.', 
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKTTVyaFxIp47XiscfSQOXWQxuiIvRxUmWPg&s' 
    },
    { 
      id: 4, 
      titulo: 'El Futuro de la Realidad Aumentada', 
      autor: 'Gadget Daily', 
      desc: 'Apple y Meta compiten por dominar el mercado de visores que mezclan el mundo físico con el digital de forma perfecta.', 
      img: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop' 
    },
    { 
      id: 5, 
      titulo: 'Descubrimiento Arqueológico en Egipto', 
      autor: 'History Today', 
      desc: 'Encuentran una cámara oculta bajo la Gran Pirámide que podría contener textos inéditos sobre la construcción de las mismas.', 
      img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400&h=300&fit=crop' 
    },
    { 
      id: 6, 
      titulo: 'Ciberseguridad en 2026', 
      autor: 'Secure Tech', 
      desc: 'Aumentan los ataques mediante "Deepfakes" y las empresas refuerzan su seguridad con biometría avanzada.', 
      img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop' 
    },
    { 
      id: 7, 
      titulo: 'Nueva Generación de Consolas', 
      autor: 'Gamer News', 
      desc: 'Rumores indican que la próxima consola de Nintendo llegará con potencia similar a una PS5 en modo portátil.', 
      img: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop' 
    },
    { 
      id: 8, 
      titulo: 'Medicina Genética Avanza', 
      autor: 'Health Lab', 
      desc: 'Primera terapia génica aprobada para corregir problemas de visión heredados muestra resultados sorprendentes en niños.', 
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyyIN-QS62u4iincK9jZffUWH0TpYFiTC3pw&s' 
    },
    { 
      id: 9, 
      titulo: 'Vehículos Autónomos en Ciudad', 
      autor: 'Mobility Mag', 
      desc: 'Varias ciudades del mundo comienzan a integrar carriles exclusivos para taxis sin conductor las 24 horas.', 
      img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMHq3T20podtxCJC4I7dNT5zjVV4ejdsr5hw&s' 
    },
    { 
      id: 10, 
      titulo: 'Telescopio James Webb Sorprende', 
      autor: 'Cosmos News', 
      desc: 'Nuevas imágenes captan el nacimiento de una galaxia a millones de años luz, revelando detalles nunca antes vistos.', 
      img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=300&fit=crop' 
    }
  ];

  constructor() {}
}