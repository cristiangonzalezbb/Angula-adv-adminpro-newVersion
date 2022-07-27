import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  //menuItems: any[];
  //Forma 1 de hacerlo fin
  //public imgUrl: string = '';
  //public nombre: string = '';
  //Forma 1 de hacerlo fin

  usuario: Usuario;
  constructor(public sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
      //this.menuItems = sidebarService.menu;
      //console.log(this.menuItems);
      //Forma 1 de hacerlo
      //this.imgUrl = usuarioService.usuario.imagenUrl;
      //this.nombre = usuarioService.usuario.nombre; 
      //Forma 1 de hacerlo fin
      this.usuario = usuarioService.usuario;
   }

  ngOnInit(): void {
  }

}
