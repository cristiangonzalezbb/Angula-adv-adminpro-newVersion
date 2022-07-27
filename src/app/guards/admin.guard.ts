import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService,
              private router: Router){}
  //Ahora se puede utilizar el Guard, se debe utilizar según el proyecto
  //Siempre va en donde se definen las rutas

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if  (this.usuarioService.role === 'ADMIN_ROLE') {
      return true;
    } else {
      this.router.navigateByUrl('/dashboard')
      return false;
    }
    
    //devuelvo un ternario
    //return (this.usuarioService.role === 'ADMIN_ROLE') ? true: false ;
  }
  
}
