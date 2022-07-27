import { Component } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent  {

  usuario: Usuario;

  constructor(private usuarioService: UsuarioService,
              private router: Router) { 
    this.usuario = usuarioService.usuario; 
  }

  logout() {
    this.usuarioService.logout();
  }

  buscar(termino: string){

    if (termino.length === 0) {
      return;
    }
    //console.log(termino);
    //this.router.navigateByUrl('/dashboard', 'buscar', termino );
    this.router.navigateByUrl(`/dashboard/buscar/${ termino}`);
    
  }

}
